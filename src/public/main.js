const WORDS_PER_MINUTE = 200;
const POSTS_PER_PAGE = 5;
let currentPage = 1;
let allSortedPosts = [];

function readingTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function formatDate(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function renderRecentPosts(posts, lang) {
  const container = document.querySelector('div#recent-posts');
  if (!container || !posts || posts.length === 0) {
    if (container) {
      container.innerHTML = lang === 'de'
        ? '<p>Noch keine Beiträge vorhanden.</p>'
        : '<p>No posts yet.</p>';
    }
    return;
  }
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);
  let html = '';
  pagePosts.forEach(post => {
    const tags = (post.tags || []).map(t =>
      `<span class="tag-chip">${escapeHtml(t)}</span>`
    ).join('');
    // post.cover is site-root relative ('/images/posts/…/cover.png'), so the site root
    // has to be prepended - using it bare would resolve to the domain root and break on
    // the /Blog/ sub-path. The title link next to it already names the post, so alt is
    // intentionally empty.
    const thumb = post.cover
      ? `<img class="post-thumb" src="${escapeAttr(resolveBaseUrl() + post.cover)}" alt="" loading="lazy">`
      : '';
    html += `<div class="post-card">${thumb}
      <h3><a href="${escapeAttr(post.url)}">${escapeHtml(post.title)}</a></h3>
      <div class="meta">${formatDate(post.date, lang)} · ${readingTime(post.wordCount)} ${lang === 'de' ? 'Min. Lesezeit' : 'min read'}</div>
      ${tags ? `<div class="tags">${tags}</div>` : ''}
      <p class="excerpt">${escapeHtml(post.excerpt || '')}</p>
    </div>`;
  });
  container.innerHTML = html;
}

function renderPagination(totalPosts, lang) {
  const nav = document.getElementById('pagination');
  if (!nav) return;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  if (totalPages <= 1) {
    nav.innerHTML = '';
    return;
  }
  const prevLabel = lang === 'de' ? 'Zurück' : 'Prev';
  const nextLabel = lang === 'de' ? 'Weiter' : 'Next';
  let html = '';
  if (currentPage > 1) {
    html += `<a href="#" data-page="${currentPage - 1}" class="page-link page-prev">${prevLabel}</a>`;
  } else {
    html += `<span class="page-link page-prev disabled">${prevLabel}</span>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<span class="page-link active">${i}</span>`;
    } else {
      html += `<a href="#" data-page="${i}" class="page-link">${i}</a>`;
    }
  }
  if (currentPage < totalPages) {
    html += `<a href="#" data-page="${currentPage + 1}" class="page-link page-next">${nextLabel}</a>`;
  } else {
    html += `<span class="page-link page-next disabled">${nextLabel}</span>`;
  }
  nav.innerHTML = html;
  nav.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(parseInt(link.dataset.page, 10));
    });
  });
}

function showPage(page) {
  currentPage = page;
  const lang = detectLang();
  renderRecentPosts(allSortedPosts, lang);
  renderPagination(allSortedPosts.length, lang);
  const postsContainer = document.querySelector('div#recent-posts');
  if (postsContainer) {
    postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderPostNav(posts, currentUrl, lang) {
  const container = document.getElementById('post-nav');
  if (!container || !posts) return;
  const sorted = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  let idx = -1;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].url === currentUrl) { idx = i; break; }
  }
  if (idx === -1) return;
  let html = '';
  if (idx > 0) {
    html += `<a class="prev" href="${escapeAttr(sorted[idx - 1].url)}">${escapeHtml(sorted[idx - 1].title)}</a>`;
  } else {
    html += '<span></span>';
  }
  const homeLabel = lang === 'de' ? 'Startseite' : 'Home';
  html += `<a href="${resolveBaseUrl()}/index.html">${homeLabel}</a>`;
  if (idx < sorted.length - 1) {
    html += `<a class="next" href="${escapeAttr(sorted[idx + 1].url)}">${escapeHtml(sorted[idx + 1].title)}</a>`;
  } else {
    html += '<span></span>';
  }
  container.innerHTML = html;
}

function injectNavbarLangSwitcher(lang) {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (navbar.querySelector('.lang-switcher-btn')) return;
  const label = lang === 'de' ? 'EN' : 'DE';
  const btn = document.createElement('a');
  btn.className = 'lang-switcher-btn';
  btn.setAttribute('data-lang-switcher', '');
  btn.href = '#';
  btn.textContent = label;
  btn.title = lang === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln';
  const searchForm = navbar.querySelector('#search');
  if (searchForm && searchForm.parentNode) {
    searchForm.parentNode.insertBefore(btn, searchForm);
  } else {
    navbar.appendChild(btn);
  }
}

function resolveLanguageSwitcher() {
  const switcherLink = document.querySelector('a[data-lang-switcher]');
  if (!switcherLink) return;
  fetch(resolveBaseUrl() + '/language-switcher.json')
    .then(r => r.json())
    .then(map => {
      const current = window.location.pathname;
      const key = current.replace(/\/+$/, '');
      if (map[key]) {
        switcherLink.href = map[key];
      }
    })
    .catch(() => {});
}

function getSiteRoot() {
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src || '';
    if (src.indexOf('docfx.min.js') !== -1) {
      return src.replace(/\/public\/docfx\.min\.js.*$/, '');
    }
  }
  return '';
}

function resolveBaseUrl() {
  return getSiteRoot();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function detectLang() {
  return window.location.pathname.indexOf('/de/') !== -1 ? 'de' : 'en';
}

function init() {
  const lang = detectLang();
  // Remember the language so the site root redirects to it on the next visit (set once).
  try { localStorage.setItem('lang', lang); } catch (err) {}
  const isLanding = document.querySelector('div#recent-posts') !== null;
  const isPost = document.getElementById('post-nav') !== null;

  injectNavbarLangSwitcher(lang);
  resolveLanguageSwitcher();

  if (!isLanding && !isPost) return;

  const postsPath = resolveBaseUrl() + '/posts-' + lang + '.json';
  fetch(postsPath)
    .then(r => r.json())
    .then(posts => {
      allSortedPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      if (isLanding) {
        renderRecentPosts(allSortedPosts, lang);
        renderPagination(allSortedPosts.length, lang);
      }
      if (isPost) {
        const currentUrl = window.location.pathname.replace(/\/+$/, '');
        const normalizedPosts = posts.map(p => {
          p.url = '/' + p.url.replace(/^\/+/, '').replace(/\/+$/, '');
          return p;
        });
        renderPostNav(normalizedPosts, currentUrl, lang);
      }
    })
    .catch(err => {
      console.warn('Failed to load posts:', err);
    });
}

// docfx.min.js pulls this module in with a dynamic import(), which resolves
// after DOMContentLoaded has already fired. Listening for the event alone would
// therefore never run, so call init() directly unless the document is still
// loading.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export default {};
