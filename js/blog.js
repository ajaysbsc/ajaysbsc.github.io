/**
 * Returns a new array of blog post elements sorted by their data-date attribute.
 * @param {HTMLElement[]} posts
 * @param {('newest'|'oldest')} [order='newest']
 * @returns {HTMLElement[]} Sorted copy of the provided posts
 */
export function sortBlogPosts(posts, order = 'newest') {
    if (!Array.isArray(posts)) {
        throw new TypeError('Expected posts to be an array');
    }

    const direction = order === 'oldest' ? 1 : -1;

    return [...posts].sort((a, b) => {
        const dateA = new Date(a?.getAttribute?.('data-date'));
        const dateB = new Date(b?.getAttribute?.('data-date'));

        if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
            return 0;
        }

        return direction * (dateA - dateB);
    });
}

const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

const categoryLabels = {
    antarctica: 'Antarctica',
    himalayas: 'Himalayas',
    nepal: 'Nepal'
};

const categoryBadgeClasses = {
    antarctica: 'bg-blue-500/80',
    himalayas: 'bg-green-500/80',
    nepal: 'bg-indigo-500/80'
};

const dateFormatter = typeof Intl !== 'undefined'
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

const state = {
    allPosts: [],
    publishedPosts: [],
    filter: 'all',
    sortOrder: 'newest',
    filterButtons: []
};

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => htmlEscapeMap[char] ?? char);
}

function formatDate(dateString) {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return dateFormatter ? dateFormatter.format(date) : date.toISOString().slice(0, 10);
}

function sortPostData(posts, order = 'newest') {
    const direction = order === 'oldest' ? 1 : -1;

    return [...posts].sort((a, b) => {
        const dateA = new Date(a.date ?? 0);
        const dateB = new Date(b.date ?? 0);
        return direction * (dateA - dateB);
    });
}

async function fetchBlogPosts() {
    if (typeof fetch !== 'function') {
        return [];
    }

    try {
        const response = await fetch('data/blog-posts.json', { cache: 'no-store' });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return Array.isArray(data?.posts) ? data.posts : [];
    } catch (error) {
        console.error('Failed to load blog posts', error);
        return [];
    }
}

function getCategoryLabel(category) {
    return categoryLabels[category] ?? category?.replace(/(^|\s)([a-z])/g, (_, prefix, char) => `${prefix}${char.toUpperCase()}`) ?? '';
}

function getBadgeClass(category) {
    return categoryBadgeClasses[category] ?? 'bg-gray-500/80';
}

function getVisiblePosts() {
    let posts = state.publishedPosts;

    if (state.filter !== 'all') {
        posts = posts.filter((post) => post.category === state.filter);
    }

    return sortPostData(posts, state.sortOrder);
}

function getFilterButtonClasses(isActive) {
    const baseClasses = 'px-6 py-3 rounded-full text-sm font-medium shadow-sm transition-colors';

    if (isActive) {
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    return `${baseClasses} bg-white text-gray-700 hover:bg-gray-100`;
}

function updateFilterButtonStyles() {
    if (!Array.isArray(state.filterButtons)) {
        return;
    }

    state.filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === state.filter;
        button.className = getFilterButtonClasses(isActive);
    });
}

function renderControls() {
    const controls = document.getElementById('blog-controls');
    const categoryContainer = document.getElementById('category-buttons');
    const sortContainer = document.getElementById('sort-container');
    const sortSelect = document.getElementById('sort-select');

    if (!controls || !categoryContainer || !sortContainer || !sortSelect) {
        return;
    }

    if (state.publishedPosts.length === 0) {
        controls.classList.add('hidden');
        return;
    }

    controls.classList.remove('hidden');
    categoryContainer.innerHTML = '';
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
            updateFilterButtonStyles();
            refresh();
        });
        categoryContainer.appendChild(button);
        state.filterButtons.push(button);
    };

    addButton('All Expeditions', 'all');

    const categories = Array.from(new Set(state.publishedPosts.map((post) => post.category))).sort((a, b) => (
        getCategoryLabel(a).localeCompare(getCategoryLabel(b))
    ));

    categories.forEach((category) => {
        addButton(getCategoryLabel(category), category);
    });

    updateFilterButtonStyles();

    if (state.publishedPosts.length < 2) {
        sortContainer.classList.add('hidden');
    } else {
        sortContainer.classList.remove('hidden');
    }

    sortSelect.value = state.sortOrder;
    sortSelect.onchange = (event) => {
        const value = event.target.value === 'oldest' ? 'oldest' : 'newest';
        if (state.sortOrder !== value) {
            state.sortOrder = value;
            refresh();
        }
    };
}

function createBlogCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-post blog-card-hover';
    article.setAttribute('data-date', post.date ?? '');
    article.setAttribute('data-category', post.category ?? '');

    const badgeClass = getBadgeClass(post.category);
    const badgeLabel = getCategoryLabel(post.category);

    article.innerHTML = `
        <div class="bg-white rounded-xl overflow-hidden shadow-lg h-full">
            <div class="relative">
                <img src="${escapeHtml(post.heroImage ?? '')}" alt="${escapeHtml(post.title ?? '')}" class="w-full h-64 object-cover" loading="lazy">
                <div class="absolute top-3 right-3">
                    <span class="px-3 py-1 ${badgeClass} text-white text-xs font-medium rounded-full backdrop-blur-sm">${escapeHtml(badgeLabel)}</span>
                </div>
            </div>
            <div class="p-6 flex flex-col h-[calc(100%-16rem)]">
                <h3 class="text-xl font-bold mb-2 text-gray-900">${escapeHtml(post.title ?? '')}</h3>
                <div class="text-sm text-gray-500 mb-3">${escapeHtml(formatDate(post.date))}</div>
                <p class="text-gray-600 mb-4 flex-grow">${escapeHtml(post.excerpt ?? '')}</p>
                <a href="${escapeHtml(post.url ?? '#')}" class="text-blue-600 hover:text-blue-800 font-medium flex items-center mt-auto">
                    Read More <i class="fas fa-arrow-right ml-2 text-sm"></i>
                </a>
            </div>
        </div>
    `;

    return article;
}

function renderPosts(posts) {
    const grid = document.getElementById('blog-grid');

    if (!grid) {
        return;
    }

    grid.innerHTML = '';

    posts.forEach((post) => {
        grid.appendChild(createBlogCard(post));
    });
}

function createFeaturedContent(post) {
    const wrapper = document.createElement('article');
    wrapper.className = 'bg-white rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-300 relative';

    wrapper.innerHTML = `
        <div class="md:flex">
            <div class="md:w-1/2 relative">
                <img src="${escapeHtml(post.heroImage ?? '')}" alt="${escapeHtml(post.title ?? '')}" class="w-full h-full object-cover" loading="lazy">
                <div class="absolute top-4 left-4">
                    <span class="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-medium shadow-lg">Featured</span>
                </div>
            </div>
            <div class="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div class="mb-4 flex items-center text-sm text-gray-500">
                    <span>${escapeHtml(formatDate(post.date))}</span>
                    <span class="mx-2 text-gray-300">•</span>
                    <span class="text-blue-500">${escapeHtml(getCategoryLabel(post.category))}</span>
                </div>
                <h2 class="text-3xl font-bold mb-6 text-gray-900">${escapeHtml(post.title ?? '')}</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">${escapeHtml(post.excerpt ?? '')}</p>
                <a href="${escapeHtml(post.url ?? '#')}" class="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors">
                    Read Full Story <span class="ml-2">→</span>
                </a>
            </div>
        </div>
    `;

    return wrapper;
}

function renderFeatured(posts) {
    const section = document.getElementById('featured-section');
    const container = document.getElementById('featured-content');

    if (!section || !container) {
        return;
    }

    container.innerHTML = '';

    const featuredPosts = sortPostData(posts.filter((post) => post.featured), 'newest');

    if (featuredPosts.length === 0) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    container.appendChild(createFeaturedContent(featuredPosts[0]));
}

function toggleEmptyState(isEmpty) {
    const emptyState = document.getElementById('blog-empty-state');

    if (!emptyState) {
        return;
    }

    if (isEmpty) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

function refresh() {
    renderFeatured(state.publishedPosts);

    const visiblePosts = getVisiblePosts();
    renderPosts(visiblePosts);
    toggleEmptyState(visiblePosts.length === 0);
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

async function runBlogPage() {
    setupMobileMenu();

    const posts = await fetchBlogPosts();
    state.allPosts = posts;
    state.publishedPosts = posts.filter((post) => post?.published);
    state.filter = 'all';
    state.sortOrder = 'newest';

    renderControls();
    refresh();
}

export function initBlogPage() {
    if (typeof document === 'undefined') {
        return Promise.resolve();
    }

    const launch = () => runBlogPage().catch((error) => {
        console.error('Failed to initialise blog page', error);
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
