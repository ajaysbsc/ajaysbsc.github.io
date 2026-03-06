/**
 * Publications Page — Dynamic Renderer
 * Reads from /data/publications.json and renders compact citation-style entries
 * with filtering, search, and collapsible sections.
 */

(function () {
  'use strict';

  /* ── Configuration ─────────────────────────── */
  const AUTHOR_HIGHLIGHT = 'Godara';
  const TYPE_ORDER = ['journal', 'conference', 'preprint', 'book-chapter', 'poster'];
  const TYPE_LABELS = {
    journal: 'Journal Articles',
    conference: 'Conferences',
    preprint: 'Preprints',
    'book-chapter': 'Book Chapters',
    poster: 'Posters & Talks'
  };
  const STATUS_LABELS = {
    published: { text: 'Published', cls: 'pub-status-published' },
    'under-review': { text: 'Under Review', cls: 'pub-status-review' },
    accepted: { text: 'Accepted', cls: 'pub-status-accepted' },
    preprint: { text: 'Preprint', cls: 'pub-status-preprint' },
    presented: { text: 'Presented', cls: 'pub-status-presented' }
  };
  const LINK_ICONS = {
    paper: { icon: 'fa-file-alt', label: 'Paper' },
    doi: { icon: 'fa-link', label: 'DOI' },
    preprint: { icon: 'fa-file-pdf', label: 'Preprint' },
    slides: { icon: 'fa-desktop', label: 'Slides' },
    poster: { icon: 'fa-image', label: 'Poster' },
    code: { icon: 'fa-code', label: 'Code' },
    data: { icon: 'fa-database', label: 'Data' }
  };

  /* ── State ──────────────────────────────────── */
  let allPublications = [];
  let activeTypeFilter = 'all';
  let activeYearFilter = 'all';
  let searchQuery = '';
  let collapsedSections = new Set();

  /* ── DOM References ─────────────────────────── */
  const featuredContainer = document.getElementById('featured-publications');
  const archiveContainer = document.getElementById('archive-publications');
  const searchInput = document.getElementById('pub-search');
  const typeFilterContainer = document.getElementById('type-filters');
  const yearFilterContainer = document.getElementById('year-filters');
  const pubCountEl = document.getElementById('pub-count');
  const noResultsEl = document.getElementById('no-results');

  /* ── Initialise ─────────────────────────────── */
  function init() {
    // Use inline data from window.PUBLICATIONS_DATA (set in the HTML)
    // Falls back to fetch if inline data is not available
    if (window.PUBLICATIONS_DATA && window.PUBLICATIONS_DATA.length) {
      allPublications = window.PUBLICATIONS_DATA.slice();
      allPublications.sort((a, b) => b.year - a.year);
      buildFilters();
      renderFeatured();
      renderArchive();
      bindEvents();
    } else {
      // Fallback: try loading from JSON file
      fetch('data/publications.json')
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then(data => {
          allPublications = data;
          allPublications.sort((a, b) => b.year - a.year);
          buildFilters();
          renderFeatured();
          renderArchive();
          bindEvents();
        })
        .catch(err => {
          console.error('Failed to load publications:', err);
          if (archiveContainer) {
            archiveContainer.innerHTML =
              '<p class="text-center text-gray-500 py-8">Unable to load publications. Please try again later.</p>';
          }
        });
    }
  }

  /* ── Filters ────────────────────────────────── */
  function buildFilters() {
    // Type filter pills
    const types = [...new Set(allPublications.map(p => p.type))];
    if (typeFilterContainer) {
      let html = '<button class="pub-filter-pill active" data-type="all">All</button>';
      TYPE_ORDER.forEach(t => {
        if (types.includes(t)) {
          html += `<button class="pub-filter-pill" data-type="${t}">${TYPE_LABELS[t] || t}</button>`;
        }
      });
      typeFilterContainer.innerHTML = html;
    }

    // Year filter pills
    const years = [...new Set(allPublications.map(p => p.year))].sort((a, b) => b - a);
    if (yearFilterContainer) {
      let html = '<button class="pub-filter-pill active" data-year="all">All Years</button>';
      years.forEach(y => {
        html += `<button class="pub-filter-pill" data-year="${y}">${y}</button>`;
      });
      yearFilterContainer.innerHTML = html;
    }
  }

  function getFiltered() {
    return allPublications.filter(p => {
      if (activeTypeFilter !== 'all' && p.type !== activeTypeFilter) return false;
      if (activeYearFilter !== 'all' && p.year !== Number(activeYearFilter)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          p.title,
          p.authors.join(' '),
          p.venue,
          String(p.year),
          ...(p.topics || [])
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  /* ── Render: Featured ───────────────────────── */
  function renderFeatured() {
    if (!featuredContainer) return;
    const featured = allPublications.filter(p => p.featured);
    if (!featured.length) {
      featuredContainer.closest('section').style.display = 'none';
      return;
    }
    featuredContainer.innerHTML = featured.map(renderFeaturedItem).join('');
  }

  function renderFeaturedItem(pub) {
    return `
      <article class="pub-featured-item">
        <div class="pub-featured-content">
          <div class="pub-featured-year">${pub.year}</div>
          <div class="pub-featured-body">
            <h3 class="pub-featured-title">${pub.title}</h3>
            <p class="pub-featured-authors">${formatAuthors(pub.authors)}</p>
            <p class="pub-featured-venue">
              <em>${pub.venue}</em>${pub.volume ? `, ${pub.volume}` : ''}${pub.pages ? `, ${pub.pages}` : ''}${pub.articleNumber ? `, article ${pub.articleNumber}` : ''}
            </p>
            <div class="pub-featured-links">${renderLinks(pub.links)}</div>
          </div>
        </div>
      </article>`;
  }

  /* ── Render: Archive ────────────────────────── */
  function renderArchive() {
    if (!archiveContainer) return;
    const filtered = getFiltered();

    // Update count
    if (pubCountEl) {
      pubCountEl.textContent = `${filtered.length} publication${filtered.length !== 1 ? 's' : ''}`;
    }

    if (!filtered.length) {
      archiveContainer.innerHTML = '';
      if (noResultsEl) noResultsEl.style.display = 'block';
      return;
    }
    if (noResultsEl) noResultsEl.style.display = 'none';

    // Group by type
    const groups = {};
    filtered.forEach(p => {
      if (!groups[p.type]) groups[p.type] = [];
      groups[p.type].push(p);
    });

    let html = '';
    TYPE_ORDER.forEach(type => {
      if (!groups[type]) return;
      const items = groups[type];
      const isCollapsed = collapsedSections.has(type);
      html += `
        <div class="pub-type-group" data-group="${type}">
          <button class="pub-group-header" data-toggle="${type}" aria-expanded="${!isCollapsed}">
            <span class="pub-group-title">
              <i class="fas fa-chevron-right pub-chevron ${isCollapsed ? '' : 'pub-chevron-open'}"></i>
              ${TYPE_LABELS[type] || type}
            </span>
            <span class="pub-group-count">${items.length}</span>
          </button>
          <div class="pub-group-body ${isCollapsed ? 'pub-group-collapsed' : ''}">
            ${renderGroupByYear(items)}
          </div>
        </div>`;
    });

    archiveContainer.innerHTML = html;
  }

  function renderGroupByYear(items) {
    // Sub-group by year
    const byYear = {};
    items.forEach(p => {
      if (!byYear[p.year]) byYear[p.year] = [];
      byYear[p.year].push(p);
    });
    const years = Object.keys(byYear).sort((a, b) => b - a);

    return years.map(year => `
      <div class="pub-year-block">
        <div class="pub-year-label">${year}</div>
        <div class="pub-year-items">
          ${byYear[year].map(renderCitationItem).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderCitationItem(pub) {
    const status = pub.status && STATUS_LABELS[pub.status]
      ? `<span class="pub-status ${STATUS_LABELS[pub.status].cls}">${STATUS_LABELS[pub.status].text}</span>`
      : '';

    const venueInfo = [
      pub.venue,
      pub.volume ? `Vol. ${pub.volume}` : '',
      pub.pages || '',
      pub.articleNumber ? `article ${pub.articleNumber}` : '',
      pub.location || ''
    ].filter(Boolean).join(', ');

    return `
      <div class="pub-citation">
        <div class="pub-citation-main">
          <span class="pub-citation-title">${pub.title}</span>
          ${status}
          <div class="pub-citation-meta">
            <span class="pub-citation-authors">${formatAuthors(pub.authors)}</span>
            <span class="pub-citation-venue">${venueInfo}${pub.date ? ` — ${pub.date}` : ''}</span>
          </div>
        </div>
        ${Object.keys(pub.links).length ? `<div class="pub-citation-links">${renderLinks(pub.links)}</div>` : ''}
      </div>`;
  }

  /* ── Helpers ────────────────────────────────── */
  function formatAuthors(authors) {
    return authors.map(a =>
      a.includes(AUTHOR_HIGHLIGHT)
        ? `<strong class="pub-author-highlight">${a}</strong>`
        : a
    ).join(', ');
  }

  function renderLinks(links) {
    return Object.entries(links).map(([key, url]) => {
      const meta = LINK_ICONS[key] || { icon: 'fa-external-link-alt', label: key };
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="pub-action-link">
        <i class="fas ${meta.icon}"></i> ${meta.label}
      </a>`;
    }).join('');
  }

  /* ── Events ─────────────────────────────────── */
  function bindEvents() {
    // Search
    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          searchQuery = searchInput.value.trim();
          renderArchive();
        }, 250);
      });
    }

    // Type filter
    if (typeFilterContainer) {
      typeFilterContainer.addEventListener('click', e => {
        const btn = e.target.closest('.pub-filter-pill');
        if (!btn) return;
        activeTypeFilter = btn.dataset.type;
        typeFilterContainer.querySelectorAll('.pub-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderArchive();
      });
    }

    // Year filter
    if (yearFilterContainer) {
      yearFilterContainer.addEventListener('click', e => {
        const btn = e.target.closest('.pub-filter-pill');
        if (!btn) return;
        activeYearFilter = btn.dataset.year;
        yearFilterContainer.querySelectorAll('.pub-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderArchive();
      });
    }

    // Collapsible group headers (event delegation)
    if (archiveContainer) {
      archiveContainer.addEventListener('click', e => {
        const hdr = e.target.closest('.pub-group-header');
        if (!hdr) return;
        const type = hdr.dataset.toggle;
        if (collapsedSections.has(type)) {
          collapsedSections.delete(type);
        } else {
          collapsedSections.add(type);
        }
        renderArchive();
      });
    }
  }

  /* ── Boot ───────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
