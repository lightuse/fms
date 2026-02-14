#!/usr/bin/env bash
set -euo pipefail

# Create GitHub issues from specs/001-fms-core/tasks_sprint_breakdown.md
# Requirements: GitHub CLI (gh) must be installed and authenticated (gh auth login)
# Usage: ./scripts/create_issues_from_tasks.sh --dry-run

TASK_FILE="specs/001-fms-core/tasks_sprint_breakdown.md"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --help) echo "Usage: $0 [--dry-run]"; exit 0 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install from https://cli.github.com/ and authenticate with 'gh auth login'" >&2
  exit 2
fi

current_milestone="Unassigned"

create_issue(){
  local tid="$1"; shift
  local title="$1"; shift
  local body="$1"; shift
  local milestone="$1"; shift

  echo "Creating issue: [$tid] $title -> milestone: $milestone"
  if [ "$DRY_RUN" = true ]; then
    echo "DRY RUN: gh issue create --title "$title" --body "$body" --label fms-task --milestone \"$milestone\""
  else
    gh issue create --title "$tid - $title" --body "$body" --label "fms-task" --milestone "$milestone"
  fi
}

parse_tasks(){
  awk '
    /^# / { current = $0; sub(/^# /, "", current); next }
    /^- \[ \] T/ { print current "||" $0 }
  ' "$TASK_FILE" | while IFS="||" read -r heading line; do
    # Example line: - [ ] T033 [US3] Implement proximity search API (...) 
    tid=$(echo "$line" | sed -E "s/^- \[ \] ([^ ]+).*/\1/")
    title=$(echo "$line" | sed -E "s/^- \[ \] [^ ]+ (.*)$/\1/")
    body="Task generated from tasks_sprint_breakdown.md\n\nContext: $heading\n\nOriginal line:\n$line"
    milestone="$heading"
    create_issue "$tid" "$title" "$body" "$milestone"
  done
}

parse_tasks
