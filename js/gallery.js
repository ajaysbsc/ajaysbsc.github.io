const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

const state = {
    galleries: [],
    filter: 'all',
    filterButtons: []
};

function parseYearFromValue(value) {
    if (value == null) {
        return null;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    const match = String(value).match(/(19|20)\d{2}/);
    return match ? Number.parseInt(match[0], 10) : null;
}

function compareGalleriesByYearDesc(a, b) {
    const yearA = parseYearFromValue(a?.year ?? a?.name) ?? 0;
    const yearB = parseYearFromValue(b?.year ?? b?.name) ?? 0;

    if (yearA !== yearB) {
        return yearB - yearA;
    }

    return (a?.name ?? '').localeCompare(b?.name ?? '');
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => htmlEscapeMap[char] ?? char);
}

function prettifyFilename(filename, index) {
    const base = (filename ?? '').replace(/\.[^.]+$/, '');

    if (!base) {
        return `Image ${index + 1}`;
    }

    const normalized = base.replace(/[-_]+/g, ' ').trim();

    if (!normalized) {
        return `Image ${index + 1}`;
    }

    const compact = normalized.replace(/\s+/g, '');
    const label = /^[A-Za-z]+\d+$/.test(compact)
        ? normalized.toUpperCase()
        : normalized.replace(/\b([a-z])/g, (_, char) => char.toUpperCase());

    return `Image ${index + 1} · ${label}`;
}

function getFilterButtonClasses(isActive) {
    const baseClasses = 'px-8 py-3 rounded-full text-sm font-medium shadow-lg transition-all duration-300';

    if (isActive) {
        return `${baseClasses} filter-btn active`;
    }

    return `${baseClasses} filter-btn`;
}

function updateFilterButtons() {
    state.filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === state.filter;
        button.className = getFilterButtonClasses(isActive);
    });
}

async function fetchGalleryData() {
    if (typeof fetch !== 'function') {
        return { galleries: [] };
    }

    try {
        const response = await fetch('data/gallery.json', { cache: 'no-store' });
        if (!response.ok) {
            return { galleries: [] };
        }
        const data = await response.json();
        return {
            galleries: Array.isArray(data?.galleries) ? data.galleries : []
        };
    } catch (error) {
        console.error('Failed to load gallery data', error);
        return { galleries: [] };
    }
}

function renderFilterButtons() {
    const controls = document.getElementById('gallery-controls');
    const container = document.getElementById('gallery-filter-buttons');

    if (!controls || !container) {
        return;
    }

    if (!state.galleries.length) {
        controls.classList.add('hidden');
        return;
    }

    controls.classList.remove('hidden');
    container.innerHTML = '';
    state.filterButtons = [];

    const addButton = (label, value) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.filter = value;
        button.textContent = label;
        button.className = getFilterButtonClasses(state.filter === value);
        button.addEventListener('click', () => {
            if (state.filter === value) {
                return;
            }
            state.filter = value;
            updateFilterButtons();
            renderGallery();
        });
        container.appendChild(button);
        state.filterButtons.push(button);
    };

    const totalImages = state.galleries.reduce((total, gallery) => total + (gallery.count ?? gallery.images?.length ?? 0), 0);
    addButton(`All Expeditions (${totalImages})`, 'all');

    state.galleries
        .slice()
        .sort(compareGalleriesByYearDesc)
        .forEach((gallery) => {
            addButton(`${gallery.name} (${gallery.count ?? gallery.images?.length ?? 0})`, gallery.slug);
        });

    updateFilterButtons();
}

function getVisibleImages() {
    const galleries = state.filter === 'all'
        ? state.galleries
        : state.galleries.filter((gallery) => gallery.slug === state.filter);

    const records = [];

    galleries.forEach((gallery) => {
        const images = Array.isArray(gallery.images) ? gallery.images : [];
        images.forEach((image, index) => {
            records.push({
                categoryName: gallery.name,
                categorySlug: gallery.slug,
                src: image?.src ?? '',
                filename: image?.filename ?? '',
                displayName: prettifyFilename(image?.filename, index),
                index
            });
        });
    });

    return records;
}

function createGalleryCard(image) {
    const wrapper = document.createElement('div');
    wrapper.className = `gallery-item ${image.categorySlug}`;
    wrapper.dataset.category = image.categorySlug;

    const title = image.categoryName;
    const subtitle = image.displayName;
    const lightboxGroup = `gallery-${image.categorySlug}`;
    const description = `${title} — ${subtitle}`;
    const badgeLabel = image.categoryName;

    wrapper.innerHTML = `
        <a href="${escapeHtml(image.src)}" data-lightbox="${escapeHtml(lightboxGroup)}" data-title="${escapeHtml(description)}">
            <div class="relative overflow-hidden rounded-xl shadow-xl group">
                <img src="${escapeHtml(image.src)}" alt="${escapeHtml(subtitle)}" class="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                    <div class="p-6 text-white">
                        <h3 class="text-xl font-bold mb-2 font-space">${escapeHtml(title)}</h3>
                        <p class="text-sm opacity-90 font-inter">${escapeHtml(subtitle)}</p>
                    </div>
                </div>
                <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-full text-xs font-medium shadow-lg">${escapeHtml(badgeLabel)}</span>
                </div>
            </div>
        </a>
    `;

    return wrapper;
}

function toggleEmptyState(isEmpty) {
    const emptyState = document.getElementById('gallery-empty-state');

    if (!emptyState) {
        return;
    }

    if (isEmpty) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');

    if (!grid) {
        return;
    }

    const images = getVisibleImages();
    grid.innerHTML = '';

    images.forEach((image) => {
        grid.appendChild(createGalleryCard(image));
    });

    toggleEmptyState(images.length === 0);

    if (typeof window !== 'undefined' && window.lightbox?.init) {
        window.lightbox.init();
    }
}

function setupMobileMenu() {
    const toggleButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!toggleButton || !mobileMenu) {
        return;
    }

    toggleButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

async function runGalleryPage() {
    setupMobileMenu();

    const { galleries } = await fetchGalleryData();
    state.galleries = galleries
        .filter((gallery) => Array.isArray(gallery.images) && gallery.images.length)
        .sort(compareGalleriesByYearDesc);
    state.filter = 'all';

    renderFilterButtons();
    renderGallery();
}

export function initGalleryPage() {
    if (typeof document === 'undefined') {
        return Promise.resolve();
    }

    const launch = () => runGalleryPage().catch((error) => {
        console.error('Failed to initialise gallery page', error);
    });

    if (document.readyState === 'loading') {
        return new Promise((resolve) => {
            document.addEventListener('DOMContentLoaded', () => {
                resolve(launch());
            }, { once: true });
        });
    }

    return launch();
}
