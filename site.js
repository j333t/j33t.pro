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

initNav();
loadMarkdown();
