const WORDS_PER_MINUTE = 200;

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
  const container = document.getElementById('recent-posts');
  if (!container || !posts || posts.length === 0) {
    if (container) {
      container.innerHTML = lang === 'de'
        ? '<p>Noch keine Beiträge vorhanden.</p>'
        : '<p>No posts yet.</p>';
    }
    return;
  }
  const sorted = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  let html = '';
  sorted.forEach(post => {
    const tags = (post.tags || []).map(t =>
      `<span class="tag-chip">${escapeHtml(t)}</span>`
    ).join('');
    html += `<div class="post-card">
      <h3><a href="${escapeAttr(post.url)}">${escapeHtml(post.title)}</a></h3>
      <div class="meta">${formatDate(post.date, lang)} · ${readingTime(post.wordCount)} ${lang === 'de' ? 'Min. Lesezeit' : 'min read'}</div>
      ${tags ? `<div class="tags">${tags}</div>` : ''}
      <p class="excerpt">${escapeHtml(post.excerpt || '')}</p>
    </div>`;
  });
  container.innerHTML = html;
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
  const isLanding = document.getElementById('recent-posts') !== null;
  const isPost = document.getElementById('post-nav') !== null;

  injectNavbarLangSwitcher(lang);
  resolveLanguageSwitcher();

  if (!isLanding && !isPost) return;

  const postsPath = resolveBaseUrl() + '/posts-' + lang + '.json';
  fetch(postsPath)
    .then(r => r.json())
    .then(posts => {
      if (isLanding) renderRecentPosts(posts, lang);
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
