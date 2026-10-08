(function () {
  'use strict';

  var WORDS_PER_MINUTE = 200;

  /**
   * Estimate reading time in minutes from word count.
   */
  function readingTime(wordCount) {
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  }

  /**
   * Format an ISO date string to a locale-friendly display.
   */
  function formatDate(dateStr, lang) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Render the "Recent Posts" card list on landing pages.
   */
  function renderRecentPosts(posts, lang) {
    var container = document.getElementById('recent-posts');
    if (!container || !posts || posts.length === 0) {
      if (container) {
        container.innerHTML = lang === 'de'
          ? '<p>Noch keine Beiträge vorhanden.</p>'
          : '<p>No posts yet.</p>';
      }
      return;
    }

    // Sort newest first
    var sorted = posts.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    var html = '';
    sorted.forEach(function (post) {
      var tags = (post.tags || []).map(function (t) {
        return '<span class="tag-chip">' + escapeHtml(t) + '</span>';
      }).join('');

      html += '<div class="post-card">' +
        '<h3><a href="' + escapeAttr(post.url) + '">' + escapeHtml(post.title) + '</a></h3>' +
        '<div class="meta">' +
          formatDate(post.date, lang) +
          ' · ' + readingTime(post.wordCount) + ' ' + (lang === 'de' ? 'Min. Lesezeit' : 'min read') +
        '</div>' +
        (tags ? '<div class="tags">' + tags + '</div>' : '') +
        '<p class="excerpt">' + escapeHtml(post.excerpt || '') + '</p>' +
      '</div>';
    });

    container.innerHTML = html;
  }

  /**
   * Render prev/next navigation at the bottom of post pages.
   */
  function renderPostNav(posts, currentUrl, lang) {
    var container = document.getElementById('post-nav');
    if (!container || !posts) return;

    var sorted = posts.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    var idx = -1;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].url === currentUrl) { idx = i; break; }
    }
    if (idx === -1) return;

    var html = '';
    if (idx > 0) {
      html += '<a class="prev" href="' + escapeAttr(sorted[idx - 1].url) + '">' +
        escapeHtml(sorted[idx - 1].title) + '</a>';
    } else {
      html += '<span></span>';
    }

    var homeLabel = lang === 'de' ? 'Startseite' : 'Home';
    html += '<a href="' + (lang === 'de' ? '../index.html' : 'index.html') + '">' + homeLabel + '</a>';

    if (idx < sorted.length - 1) {
      html += '<a class="next" href="' + escapeAttr(sorted[idx + 1].url) + '">' +
        escapeHtml(sorted[idx + 1].title) + '</a>';
    } else {
      html += '<span></span>';
    }

    container.innerHTML = html;
  }

  /**
   * Resolve the header language-switcher link from language-switcher.json.
   */
  function resolveLanguageSwitcher() {
    var switcherLink = document.querySelector('a[data-lang-switcher]');
    if (!switcherLink) return;

    fetch(resolveBaseUrl() + '/language-switcher.json')
      .then(function (r) { return r.json(); })
      .then(function (map) {
        var current = window.location.pathname;
        // Normalize: remove trailing slash, match against map keys
        var key = current.replace(/\/+$/, '');
        if (map[key]) {
          switcherLink.href = map[key];
        }
      })
      .catch(function () { /* fallback: keep inline markdown link */ });
  }

  /**
   * Determine the base URL for fetching JSON files.
   * Counts only directory depth (strips the filename), so that
   * /Blog/index.html → ".." and /Blog/de/posts/foo.html → "../../.."
   */
  function resolveBaseUrl() {
    var path = window.location.pathname;
    // Strip filename so only directory segments are counted
    var dir = path.replace(/[^\/]*$/, '');
    var parts = dir.split('/').filter(Boolean);
    var depth = parts.length;
    var prefix = '';
    for (var i = 0; i < depth; i++) prefix += '../';
    // Remove trailing slash
    return prefix.replace(/\/$/, '');
  }

  /**
   * Escape HTML entities.
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Escape attribute value.
   */
  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * Detect current language from URL path.
   */
  function detectLang() {
    return window.location.pathname.indexOf('/de/') !== -1 ? 'de' : 'en';
  }

  /**
   * Initialize on DOM ready.
   */
  document.addEventListener('DOMContentLoaded', function () {
    var lang = detectLang();
    var isLanding = document.getElementById('recent-posts') !== null;
    var isPost = document.getElementById('post-nav') !== null;

    if (!isLanding && !isPost) {
      // Still resolve language switcher on any page
      resolveLanguageSwitcher();
      return;
    }

    var postsPath = resolveBaseUrl() + '/posts-' + lang + '.json';

    fetch(postsPath)
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        if (isLanding) renderRecentPosts(posts, lang);
        if (isPost) {
          var currentUrl = window.location.pathname.replace(/\/+$/, '');
          // Normalize post URLs for comparison
          var normalizedPosts = posts.map(function (p) {
            p.url = '/' + p.url.replace(/^\/+/, '').replace(/\/+$/, '');
            return p;
          });
          renderPostNav(normalizedPosts, currentUrl, lang);
        }
      })
      .catch(function (err) {
        console.warn('Failed to load posts:', err);
      });

    resolveLanguageSwitcher();
  });
})();
