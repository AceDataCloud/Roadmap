# Ace Data Cloud — Roadmap

Product-first. Usage-driven. Capital disciplined.

This repository powers the public roadmap website: `https://roadmap.acedata.cloud`.

## What We’re Building

Ace Data Cloud is being built as an AI infrastructure platform for builders and teams who need reliable access, workflows, and monetization across modern AI systems.

Our roadmap is guided by four principles:

- Product delivery before narratives
- Usage before token mechanics
- Stability before experimentation
- Transparency over speculation

2026 sequence: **Foundation → Adoption → Scale → Consolidation**

## Why It Matters

AI teams are moving fast, but production infrastructure still breaks in predictable ways: access instability, fragmented tooling, weak cost visibility, and limited paths to distribution and monetization.

Ace Data Cloud focuses on building a reliable platform layer that turns modern AI capabilities into repeatable, auditable, and scalable workflows.

## Platform Overview

Ace Data Cloud provides stable, production-grade digital services for both enterprises and individuals:

- **For enterprises and developers:** API services and infrastructure capabilities for modern AI systems.
- **For individuals:** a one-stop, user-friendly interface for AI (Q&A, images, music, videos), proxies, datasets, and more — with out-of-the-box login and payments.
- **Open-source distribution (Nexior):** build your own AI platform quickly and sell it for profit.

Links:

- Roadmap: `https://roadmap.acedata.cloud`
- All Services: `https://platform.acedata.cloud/services`
- Developer Documentation: `https://platform.acedata.cloud/documents`
- Try Now (Hub): `https://hub.acedata.cloud`
- Open-source (Nexior): `https://github.com/AceDataCloud/Nexior`

## How $ACE Fits

$ACE is designed to strengthen alongside real usage:

- Usage-based benefits (e.g., platform fee discounts)
- Platform usage generates revenue, reinvested into product, hiring, and growth
- Token mechanisms follow adoption rather than attempting to lead it
- The token is not a substitute for product execution

## Customer Support

Welcome to the Ace Data Cloud support page. We are committed to providing you with the highest level of service and assistance. If you have any questions, concerns, or need further information about our services, please feel free to contact us.

### Contact Us

We value your feedback and are happy to help you resolve any inquiries. For questions regarding our privacy policy, services, or any other matters, please contact us through the following channels:

- Discord: `https://discord.gg/f9GRuKCmRc`
- X: `https://x.com/acedatacloud`
- CA: `GEuuznWpn6iuQAJxLKQDVGXPtrqXHNWTk3gZqqvJpump`
- Email: `office@acedata.cloud`, `office@germey.tech`
- Address: `651 N Broad St, Suite 201, Middletown, Delaware, USA`
- WeChat: (contact us by email to connect)

### Additional Information

At Ace Data Cloud, we strive to ensure that customers can receive support in a timely and effective manner. Our team is always ready to assist you with any technical issues, account inquiries, or service-related questions. Your satisfaction is our top priority, and we are committed to resolving any issues you encounter as quickly as possible.

### Frequently Asked Questions

For immediate assistance, please check our documentation section, where we have compiled answers to some common questions. If you do not find the information you need, please contact the support team.

### Feedback

We are always looking for ways to improve our services. If you have any suggestions or feedback, please feel free to share with us. Your opinions are very important to us and help us continuously enhance the user experience at Ace Data Cloud.

Thank you for choosing Ace Data Cloud. We look forward to assisting you.

Germey Technology, LLC

## Maintainers (Automation)

This repo auto-syncs merged PRs in the `AceDataCloud` GitHub org into `config/daily-updates/` (one JSON file per day), and the workflow auto-commits and pushes changes so the website stays up to date.

- Script: `scripts/sync_merged_prs_to_daily_updates.py`
- Workflow: `.github/workflows/sync_merged_prs_daily_updates.yml`
- Output:
  - Index manifest: `config/daily-updates/index.json`
  - Per-day files: `config/daily-updates/YYYY-MM-DD.json`
  - Cursor/state: `config/pr-sync-state.json`
- Secrets (optional): `REPO_PAT`, `ACEDATACLOUD_OPENAI_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`
