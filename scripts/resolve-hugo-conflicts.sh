#!/usr/bin/env bash
set -euo pipefail

if [[ ${1:-} == "" ]]; then
  echo "Usage: $0 <branch-to-merge>" >&2
  exit 1
fi

branch="$1"

echo "Fetching latest refs..."
git fetch origin "$branch"

echo "Merging origin/$branch into current branch..."
git merge --no-ff "origin/$branch"

echo "Resolving known Hugo content/layout conflicts in favor of this branch..."
files=(
  content/contact.md
  content/free-tools.md
  content/systems.md
  content/training.md
  content/work.md
  layouts/_default/baseof.html
  layouts/_default/single.html
  static/custom.css
)

for file in "${files[@]}"; do
  if [[ -f "$file" ]]; then
    git checkout --ours -- "$file"
    git add "$file"
  fi
done

echo "Completing merge commit..."
git commit -m "Resolve Hugo content/layout conflicts"

echo "Done. Push your branch with: git push"
