# AceDataCloud Roadmap

## Auto-sync merged PRs into Daily Updates

This repo can automatically append merged PRs from the `AceDataCloud` GitHub org into `config/daily-updates.json`.

- Script: `scripts/sync_merged_prs_to_daily_updates.py`
- Workflow: `.github/workflows/sync_merged_prs_daily_updates.yml` (runs hourly + supports manual dispatch)
- The workflow auto-commits and pushes changes so the website updates.

### Setup

1. Create a GitHub token that can **read** PRs across the org (include private repos if needed).
2. Add it to this repo as an Actions secret: `REPO_PAT`.

If all repos are public, the workflow may also work without this secret (it will fall back to `GITHUB_TOKEN`).

### Optional: better, more formal PR summaries (OpenAI)

If you add Actions secret `ACEDATACLOUD_OPENAI_KEY`, new PR entries will also include a more formal `title` and a `summary` based on PR metadata + changed files (truncated excerpts).

- Optional secret `OPENAI_MODEL` to override the model name (default: `gpt-4o-mini`)
- Default API base URL is `https://api.acedata.cloud` (override via `OPENAI_BASE_URL`)
