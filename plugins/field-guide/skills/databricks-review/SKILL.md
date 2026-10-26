---
name: databricks-review
description: Review Databricks bundles, job configurations, SQL, and notebooks against the Field Guide's sourced engineering rules.
---

<!-- heddle: pending #217 -->

Read [the session contract](../common.md), including permission before code sharing.

Inventory the relevant bundle, resource, job, notebook and SQL files. After
permission and sanitization, call review_databricks_code for each approved file,
in parts below its documented limit. Read a finding's cited section with
get_chapter before deciding whether it fits the code's context.

Done: findings grouped by severity with file, line, proposed fix, guide source
and official documentation where available. List reviewed and skipped files.
These are guide-rule findings, not proof that the project is safe or correct.
