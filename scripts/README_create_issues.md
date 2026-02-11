
# Create GitHub issues from sprint tasks

This script converts `specs/001-fms-core/tasks_sprint_breakdown.md` into GitHub Issues using the GitHub CLI (`gh`).

## Prerequisites

- Install GitHub CLI: https://cli.github.com/ (see official installation guide)
- Authenticate: `gh auth login` (choose GitHub.com or your enterprise host)
- Ensure you have permission to create issues in the repository

## Usage

```bash
# Dry run (no issues created)
./scripts/create_issues_from_tasks.sh --dry-run

# Create issues (will prompt if authentication/permission missing)
./scripts/create_issues_from_tasks.sh
```

## Behavior

- The script groups each task under the nearest markdown `#` heading and uses that heading as the GitHub Issue milestone name.
- Each created issue receives the label `fms-task` and the task ID is prefixed to the issue title (e.g., `T033 - Implement proximity search API`).

## Notes

- If you prefer automatic milestone creation, create milestones named `Sprint W3`, `Sprint W4`, etc., in the repo first. The script will assign the closest heading text as the milestone value.
- The script is intentionally conservative: use `--dry-run` first to preview.
