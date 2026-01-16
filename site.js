const buildShell = () => {
  const { md, page, title } = document.body.dataset;
  const pageType = page || 'default';
  const contentPath = md || '';

  const mainMarkup = pageType === 'home'
    ? ''
    : `
      <section class="section">
        <h1 class="section-title" id="page-title"></h1>
        <div class="content-body" id="page-content"></div>
      </section>
    `;

  document.body.innerHTML = `
    <header class="site-nav">
      <div class="wrap">
        <a href="/" class="brand">
          <img src="/logo.png" alt="CraftyCrow" />
        </a>
        <button class="nav-toggle" aria-label="Menu">☰</button>
        <nav class="links">
          <a href="/">Home</a>
          <a href="/work/">Work</a>
          <a href="/systems/">Systems</a>
          <a href="/training/">Training</a>
          <a href="/free-tools/">Free Tools</a>
          <a href="/contact/">Contact</a>
          <a href="https://buttondown.com/j33t/archive" target="_blank" rel="noopener">Articles ↗</a>
        </nav>
        <button class="theme-toggle" aria-label="Toggle theme" title="Toggle theme">🌓</button>
      </div>
    </header>

    <main class="content" data-md="${contentPath}" data-page="${pageType}">
      ${mainMarkup}
    </main>

    <footer class="site-foot">
      <div class="wrap foot-grid">
        <div class="foot-col">
          <div class="mini">Let’s build your tech backbone.</div>
          <div class="legal">© 2025 · J33T · Crafty Crow</div>
        </div>
        <div class="foot-col">
          <div class="mini">Contact</div>
          <ul>
            <li><a href="mailto:connect@j33t.pro">connect@j33t.pro</a></li>
            <li><a href="tel:+918092021020">+91 80920 21020</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <div class="mini">Follow</div>
          <ul>
            <li><a href="https://twitter.com/">Twitter</a></li>
            <li><a href="https://www.linkedin.com/">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `;

  if (title) document.title = title;
};

const initNav = () => {
  document.addEventListener('click', event => {
    if (event.target.closest('.nav-toggle')) {
      document.body.classList.toggle('nav-open');
      return;
    }

    if (event.target.matches('.links a')) {
      document.body.classList.remove('nav-open');
    }
  });

  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? '' : 'dark';
    if (next) {
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    } else {
      root.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  });

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.links a').forEach(link => {
    if (link.host && link.host !== window.location.host) return;
    const linkPath = link.pathname.replace(/\/$/, '') || '/';
    if (linkPath === path) link.classList.add('active');
  });
};

const parseFrontMatter = text => {
  const frontMatter = {};
  let body = text;
  if (text.startsWith('---')) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
    if (match) {
      match[1].split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        if (!key) return;
        frontMatter[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
      });
      body = text.slice(match[0].length);
    }
  }
  return { frontMatter, body };
};

const loadMarkdown = async () => {
  const main = document.querySelector('[data-md]');
  if (!main || !window.marked) return;

  const src = main.getAttribute('data-md');
  try {
    const response = await fetch(src, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load ${src}`);

    const text = await response.text();
    const { frontMatter, body } = parseFrontMatter(text);
    const html = window.marked.parse(body);
    const pageType = main.getAttribute('data-page');

    if (pageType === 'home') {
      main.innerHTML = html;
    } else {
      const title = frontMatter.title || 'J33T';
      const titleEl = document.getElementById('page-title');
      const contentEl = document.getElementById('page-content');

      if (titleEl) titleEl.textContent = title;
      if (contentEl) contentEl.innerHTML = html;
      document.title = `${title} · J33T`;
    }
  } catch (error) {
    const contentEl = document.getElementById('page-content') || main;
    if (contentEl) {
      contentEl.innerHTML = '<p>Unable to load this page right now.</p>';
    }
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

buildShell();
initNav();
loadMarkdown();
