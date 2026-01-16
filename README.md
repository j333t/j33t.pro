# J33T.pro

This site is plain HTML, CSS, and JavaScript. Content lives in Markdown files and is rendered in the browser.

## Local development

Use any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing content

Update the Markdown files in `content/` and refresh the browser to see changes.

## GitHub Pages deploy

The workflow in `.github/workflows/pages.yml` publishes the repository contents directly to GitHub Pages on every push to `main`.

## Structure

- `content/` for Markdown pages
- `index.html` and page folders (e.g. `work/`, `systems/`) for HTML shells
- `custom.css`, `site.js`, and image assets in the repo root
