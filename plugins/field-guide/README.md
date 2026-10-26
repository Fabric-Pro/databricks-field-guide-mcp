# Databricks Field Guide

Learn a concept, practice for a certification, or answer a Databricks engineering
question from dated guidance with source links. Public learning needs no account
or workspace credentials. This complements Databricks' development plugin; it
does not query your workspace or deploy anything.

In Claude Code:

```text
/plugin marketplace add Fabric-Pro/databricks-field-guide-mcp
/plugin install field-guide@techfabric-field-guide
```

In agy, from a clone of this repository:

```bash
agy plugin install ./plugins/field-guide
```

The native agy manifest and `mcp_config.json` preserve the HTTP connection.
They avoid the Claude-plugin importer's stdio-only transport conversion.
Both host configurations use the same public endpoint, checked by tests.

Start a new session after installation. Say:

> Help me learn Databricks. Start with a short diagnostic.

Or:

> Help me prepare for Databricks Data Engineer Associate. Start practice now.

Skills also handle concept lessons, code review, cost estimates and recent
changes. They route to the same public MCP tools rather than keeping their own
copy of the guide.

## Cards or conversation

In a harness that renders MCP Apps, the learning tools open interactive cards.
Claude Code and other text-only clients conduct the session one question at a
time. A client without cards does not need a different server.

## Connection check

From this plugin directory, with Node.js 20 or newer:

```bash
node scripts/doctor.mjs
```

It checks anonymous discovery, schemas, a working diagnostic, certification
practice and the interactive view resource. It does not claim to verify the
host's actual rendering. `--url http://127.0.0.1:8789/mcp` checks a local
candidate before publication.

## Limits and privacy

The guide is not affiliated with Databricks. Practice questions are generated
from the guide, not real exam questions; coverage gaps are shown. Verify current
exam requirements with the linked official exam guide. For platform syntax and
limits, use the linked official documentation.

Progress stays in the conversation unless you ask to save it. Review skills ask
before sending repository code to the public server, and exclude secrets and
customer data. Installation grants no workspace access.
