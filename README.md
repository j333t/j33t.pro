# J33T.pro

This site is now powered by Hugo.

## Local development

1. Install Hugo (extended recommended).
2. Run the dev server:

```bash
hugo server
```

## GitHub Actions (Hugo build)

The workflow is defined in `.github/workflows/hugo.yml` and runs on push, pull request, or manual dispatch.

### Commit changes

```bash
git add -A
git commit -m "Describe your change"
git push
```

### Run the workflow manually

Using the GitHub UI:
1. Go to **Actions** → **Hugo build**.
2. Click **Run workflow** and select the branch.

Using the GitHub CLI:

```bash
gh workflow run "Hugo build" --ref <branch-name>
```

## Merge conflict helper

If you hit merge conflicts on the Hugo content/layout files, run the helper script to merge a target branch and keep the restored Hugo content from this branch:

```bash
./scripts/resolve-hugo-conflicts.sh main
```

## Structure

- `content/` for pages
- `layouts/` for templates
- `static/` for assets
