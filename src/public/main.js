const WORDS_PER_MINUTE = 200;
const POSTS_PER_PAGE = 6;
let currentPage = 1;
let allSortedPosts = [];
let selectedCategory = null;
let selectedTag = null;

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

function humanize(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function label(lang, en, de) {
  return lang === 'de' ? de : en;
}

function getFilteredPosts() {
  if (selectedTag) return allSortedPosts.filter(p => (p.tags || []).includes(selectedTag));
  if (selectedCategory) return allSortedPosts.filter(p => (p.categories || []).includes(selectedCategory));
  return allSortedPosts;
}

function coverUrl(post) {
  // post.cover is site-root relative ('/images/posts/…/cover.png'), so the site root
  // has to be prepended - using it bare would resolve to the domain root and break on
  // the /Blog/ sub-path.
  return post.cover ? resolveBaseUrl() + post.cover : '';
}

function metaLine(post, lang) {
  const mins = `${readingTime(post.wordCount)} ${label(lang, 'min read', 'Min. Lesezeit')}`;
  return `<time class="post-date" datetime="${escapeAttr(post.date)}">${escapeHtml(formatDate(post.date, lang))}</time>`
    + `<span class="dot"></span><span>${mins}</span>`;
}

function renderAll(lang) {
  renderFilterBar(lang);
  renderRecentPosts(lang);
  renderPagination(getFilteredPosts().length, lang);
}

function renderFilterBar(lang) {
  const bar = document.getElementById('filter-bar');
  if (!bar) return;
  const categories = [...new Set(allSortedPosts.flatMap(p => p.categories || []))].sort();
  const countIn = cat => allSortedPosts.filter(p => (p.categories || []).includes(cat)).length;
  let html = '';
  html += `<button class="filter-pill${!selectedCategory && !selectedTag ? ' active' : ''}" data-category="">`
    + `${escapeHtml(label(lang, 'All topics', 'Alle Themen'))}<span class="count">${allSortedPosts.length}</span></button>`;
  categories.forEach(cat => {
    const isActive = selectedCategory === cat;
    html += `<button class="filter-pill${isActive ? ' active' : ''}" data-category="${escapeAttr(cat)}">`
      + `${escapeHtml(humanize(cat))}<span class="count">${countIn(cat)}</span></button>`;
  });
  bar.innerHTML = html;
  bar.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.category || null;
      selectedTag = null;
      currentPage = 1;
      renderAll(lang);
    });
  });
}

function attachTagChipHandlers(lang) {
  document.querySelectorAll('#recent-posts .tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedTag = chip.textContent.trim().toLowerCase();
      selectedCategory = null;
      currentPage = 1;
      renderAll(lang);
    });
  });
}

function postCardHtml(post, lang) {
  const tags = (post.tags || []).slice(0, 4).map(t => `<li><span class="tag-chip">${escapeHtml(t)}</span></li>`).join('');
  // The kicker rides on the cover, so it only makes sense when there is one.
  const kicker = post.cover && (post.categories || []).length
    ? `<span class="post-card-kicker">${escapeHtml(humanize(post.categories[0]))}</span>`
    : '';
  const media = post.cover
    ? `<div class="post-card-media"><img src="${escapeAttr(coverUrl(post))}" alt="" loading="lazy">${kicker}</div>`
    : '';
  // Add category class for colored hover borders
  const catClass = (post.categories && post.categories.length) ? ` cat-${post.categories[0]}` : '';
  return `<article class="post-card reveal${catClass}">
    ${media}
    <div class="post-card-body">
      <h3 class="post-card-title"><a href="${escapeAttr(post.url)}">${escapeHtml(post.title)}</a></h3>
      ${post.excerpt ? `<p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
      ${tags ? `<ul class="post-card-tags">${tags}</ul>` : ''}
      <div class="post-card-meta">${metaLine(post, lang)}</div>
    </div>
  </article>`;
}

function renderSpotlight(lang) {
  const host = document.getElementById('spotlight');
  if (!host || !allSortedPosts.length) return;
  const post = allSortedPosts[0];
  const media = post.cover
    ? `<img src="${escapeAttr(coverUrl(post))}" alt="" loading="eager">`
    : '';
  host.innerHTML = `<p class="spotlight-label">${escapeHtml(label(lang, 'Latest post', 'Neuester Beitrag'))}</p>
    <a class="spotlight-card" href="${escapeAttr(post.url)}">${media}
      <div class="spotlight-body">
        <h3>${escapeHtml(post.title)}</h3>
        ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}
        <div class="post-card-meta">${metaLine(post, lang)}</div>
      </div>
    </a>`;
}

function renderRecentPosts(lang) {
  const container = document.querySelector('div#recent-posts');
  if (!container) return;
  const filtered = getFilteredPosts();
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(label(lang,
      'No posts found for this filter.', 'Keine Beiträge für diesen Filter gefunden.'))}</div>`;
    return;
  }
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);
  let html = `<div class="post-grid">${pagePosts.map(p => postCardHtml(p, lang)).join('')}</div>`;
  if (selectedTag) {
    html += `<div class="active-tag-filter">${escapeHtml(label(lang, 'Tag:', 'Schlagwort:'))} `
      + `<strong>${escapeHtml(selectedTag)}</strong> `
      + `<a href="#" id="clear-tag-filter">${escapeHtml(label(lang, 'Clear filter', 'Filter aufheben'))}</a></div>`;
  }
  container.innerHTML = html;
  if (selectedTag) {
    document.getElementById('clear-tag-filter').addEventListener('click', e => {
      e.preventDefault();
      selectedTag = null;
      currentPage = 1;
      renderAll(lang);
    });
  }
  attachTagChipHandlers(lang);
}

function renderPagination(totalPosts, lang) {
  const nav = document.getElementById('pagination');
  if (!nav) return;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  if (totalPages <= 1) {
    nav.innerHTML = '';
    return;
  }
  const prevLabel = label(lang, 'Prev', 'Zurück');
  const nextLabel = label(lang, 'Next', 'Weiter');
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
  renderAll(lang);
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
  const card = (post, cls, labelText) =>
    `<a class="pn-card ${cls}" href="${escapeAttr(post.url)}">
      <span class="pn-label">${escapeHtml(labelText)}</span>
      <span class="pn-title">${escapeHtml(post.title)}</span>
    </a>`;
  let html = '';
  if (idx > 0) {
    html += card(sorted[idx - 1], 'prev', label(lang, 'Previous article', 'Vorheriger Beitrag'));
  } else {
    html += '<span></span>';
  }
  html += `<span class="pn-home"><a href="${resolveBaseUrl()}/index.html">${escapeHtml(label(lang, 'All posts', 'Alle Beiträge'))}</a></span>`;
  if (idx < sorted.length - 1) {
    html += card(sorted[idx + 1], 'next', label(lang, 'Next article', 'Nächster Beitrag'));
  } else {
    html += '<span></span>';
  }
  container.innerHTML = html;
}

/* Builds the article header (kicker, title, meta, tags) and turns the cover
   image into a figure. The post markdown carries none of this - DocFX renders
   only the body - so it is assembled from posts-<lang>.json at runtime. */
function decorateArticle(post, lang) {
  const article = document.querySelector('article');
  if (!article || article.querySelector('.post-head')) return;

  const title = post ? post.title : document.title.split('|')[0].trim();
  const eyebrow = post && (post.categories || []).length
    ? post.categories.map(humanize).join(' · ')
    : '';
  const tags = post && (post.tags || []).length
    ? `<ul class="post-head-tags">${post.tags.map(t => `<li><span class="tag-chip">${escapeHtml(t)}</span></li>`).join('')}</ul>`
    : '';
  const meta = post
    ? `<div class="post-meta">${metaLine(post, lang)}<span class="dot"></span>`
      + `<span class="view-counter" aria-label="${escapeHtml(label(lang, 'Views', 'Aufrufe'))}">`
      + `<span class="view-counter-icon">👁</span> <span class="view-counter-count">…</span></span>`
      + `<span class="dot"></span>`
      + `<a class="lang-link" href="#" data-lang-switcher>${escapeHtml(label(lang, 'Read in Deutsch', 'Read in English'))}</a></div>`
    : '';

  const head = document.createElement('header');
  head.className = 'post-head';
  head.innerHTML = `${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}
    <h1 class="post-head-title">${escapeHtml(title)}</h1>
    ${meta}
    ${tags}`;

  // The cover is the first paragraph of the post body: ![cover](…/cover.png)
  const firstP = article.querySelector(':scope > p');
  const coverImg = firstP ? firstP.querySelector('img') : null;
  let figure = null;
  if (coverImg && /cover/i.test(coverImg.getAttribute('src') || '')) {
    figure = document.createElement('figure');
    figure.className = 'post-cover';
    coverImg.removeAttribute('width');
    coverImg.removeAttribute('height');
    figure.appendChild(coverImg);
    firstP.replaceWith(figure);
  }

  article.prepend(head);
  if (figure) {
    head.after(figure);
  }
}

function initReadProgress() {
  if (!document.body.classList.contains('page-post')) return;
  const wrap = document.createElement('div');
  wrap.className = 'read-progress';
  wrap.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('span');
  bar.className = 'read-progress-bar';
  wrap.appendChild(bar);
  document.body.appendChild(wrap);

  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    bar.style.width = pct.toFixed(1) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

/* Fetches the pageview count for the current article from the GoatCounter API
   and renders it into the .view-counter element injected by decorateArticle().
   The GoatCounter site URL and read-only API token are read from <meta> tags
   that build.ps1 injects into every HTML file.  When no API token is configured
   the counter is hidden silently — tracking still works via the standard script. */
function initViewCounter() {
  if (!document.body.classList.contains('page-post')) return;
  const counter = document.querySelector('.view-counter');
  if (!counter) return;

  const siteMeta = document.querySelector('meta[name="goatcounter:site"]');
  const tokenMeta = document.querySelector('meta[name="goatcounter:token"]');
  const siteUrl = siteMeta ? siteMeta.getAttribute('content') : '';
  const token = tokenMeta ? tokenMeta.getAttribute('content') : '';

  // Without an API token the count cannot be fetched; hide the element.
  if (!siteUrl || !token) {
    counter.style.display = 'none';
    return;
  }

  const path = window.location.pathname;
  const apiUrl = siteUrl.replace(/\/+$/, '') + '/api/v0/count'
    + '?path=' + encodeURIComponent(path) + '&total=true';

  fetch(apiUrl, { headers: { 'Authorization': 'Bearer ' + token } })
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (data) {
      var countEl = counter.querySelector('.view-counter-count');
      if (countEl) {
        var n = (data && typeof data.count === 'number') ? data.count : 0;
        countEl.textContent = n.toLocaleString();
      }
    })
    .catch(function () {
      var countEl = counter.querySelector('.view-counter-count');
      if (countEl) countEl.textContent = '—';
    });
}

function injectNavbarLangSwitcher(lang) {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (navbar.querySelector('.lang-switcher-btn')) return;
  const btn = document.createElement('a');
  btn.className = 'lang-switcher-btn';
  btn.setAttribute('data-lang-switcher', '');
  btn.href = '#';
  btn.textContent = label(lang, 'DE', 'EN');
  btn.title = lang === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln';
  const searchForm = navbar.querySelector('#search');
  if (searchForm && searchForm.parentNode) {
    searchForm.parentNode.insertBefore(btn, searchForm);
  } else {
    navbar.appendChild(btn);
  }
}

function resolveLanguageSwitcher() {
  const switcherLinks = document.querySelectorAll('a[data-lang-switcher]');
  if (!switcherLinks.length) return;
  fetch(resolveBaseUrl() + '/language-switcher.json')
    .then(r => r.json())
    .then(map => {
      const current = window.location.pathname;
      const key = current.replace(/\/+$/, '');
      if (map[key]) {
        switcherLinks.forEach(el => { el.href = map[key]; });
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

function normalizeUrl(url) {
  return '/' + url.replace(/^\/+/, '').replace(/\/+$/, '');
}

// Typing animation for hero title
function initTypingAnimation() {
  const typedEl = document.getElementById('typed-word');
  if (!typedEl) return;

  const words = ['last', 'scale', 'evolve', 'matter'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

// Reveal on scroll animation using IntersectionObserver
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.post-card, .section-head, .hero-text, .spotlight');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

function init() {
  const lang = detectLang();
  // Remember the language so the site root redirects to it on the next visit (set once).
  try { localStorage.setItem('lang', lang); } catch (err) {}
  const isLanding = document.querySelector('div#recent-posts') !== null;
  const isPost = document.getElementById('post-nav') !== null;
  document.body.classList.add(isLanding ? 'page-landing' : isPost ? 'page-post' : 'page-plain');

  // Start typing animation on landing page
  if (isLanding) {
    initTypingAnimation();
  }

  injectNavbarLangSwitcher(lang);
  resolveLanguageSwitcher();

  if (!isLanding && !isPost) return;

  const postsPath = resolveBaseUrl() + '/posts-' + lang + '.json';
  fetch(postsPath)
    .then(r => r.json())
    .then(posts => {
      allSortedPosts = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      if (isLanding) {
        renderSpotlight(lang);
        renderAll(lang);
        // Observe reveal elements after posts are rendered
        setTimeout(initRevealOnScroll, 50);
      }
      if (isPost) {
        const currentUrl = window.location.pathname.replace(/\/+$/, '');
        const normalizedPosts = posts.map(p => { p.url = normalizeUrl(p.url); return p; });
        const current = normalizedPosts.find(p => p.url === currentUrl)
          || allSortedPosts.find(p => normalizeUrl(p.url) === currentUrl)
          || null;
        decorateArticle(current, lang);
        resolveLanguageSwitcher();
        renderPostNav(normalizedPosts, currentUrl, lang);
        initReadProgress();
        initViewCounter();
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
