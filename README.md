<p align="center">
  <img src="icon.png" alt="TechFabric mark" width="96" height="96">
</p>

# Databricks Field Guide MCP server

Learn Databricks, practice for a certification, and answer engineering questions
with the [Databricks Field Guide](https://databricks.techfabric.com).
Ask "Help me learn Databricks" to start a diagnostic, or "Help me prepare for
Data Engineer Associate" to start domain practice. The assistant uses interactive
MCP Apps cards where supported and asks one question at a time in text clients.
Answers include the guide's source sections and official documentation links.

```
https://databricks.techfabric.com/mcp
```

It's a remote server over Streamable HTTP: no local server to run, no sign-in,
and free public learning. The optional Claude Code plugin below bundles the
connection and six skills; connecting MCP alone does not install skills.

Ask how to add a Unity Catalog row filter, and the agent gets the guide's
section on it, the SQL function from that section and the Databricks
documentation behind it. Databricks' own docs stay the authority on syntax and
limits, which is why every answer links to them.

This isn't Databricks' own MCP server. Databricks runs managed MCP servers
inside a workspace that act on your data. This one is built and run by
[TechFabric](https://www.techfabric.com/databricks), a Databricks partner, and
it never connects to a workspace.

## What's in this repository

Registry descriptors and an optional client plugin. The official MCP Registry
entry names this repository, and GitHub's MCP Registry shows this README in
Copilot. The server's code isn't here and isn't open source.

| File | What it is |
| --- | --- |
| `server.json` | The server's entry in the [official MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers/com.techfabric.databricks%2Ffield-guide/versions/latest), copied as published |
| `glama.json` | Maintainer list for [Glama](https://glama.ai/mcp/connectors/com.techfabric.databricks/field-guide) |
| `icon.png`, `icon-light.png` | The TechFabric mark at 256 px, for dark and light backgrounds |
| `LICENSE` | Apache-2.0, for these files only |
| `.claude-plugin/marketplace.json` | Claude Code marketplace descriptor |
| `plugins/field-guide/` | Anonymous MCP connection, six skills and a connection-check script |

The live server and the registry are the source of truth. If this README and
the server's `tools/list` ever disagree, the server is right. A weekly GitHub
Action compares `server.json` with the registry and opens a pull request when
the entry has changed.

## Add it to your agent

### Claude Code

To install both skills and the connection, run in Claude Code:

```text
/plugin marketplace add Fabric-Pro/databricks-field-guide-mcp
/plugin install field-guide@techfabric-field-guide
```

Start a new session. The skills cover general Databricks questions, guided
learning, certifications, code review, cost estimates and recent changes.
They complement Databricks' development plugin, not replace workspace access or
deployment tooling. Keep one Field Guide connection to avoid duplicate tools.

For just the MCP connection, without skills:

```sh
claude mcp add --transport http databricks-field-guide https://databricks.techfabric.com/mcp
```

Add `--scope user` to have it in every project.

### agy

From a clone of this repository:

```sh
agy plugin install ./plugins/field-guide
```

Start a new session. The native agy manifest and `mcp_config.json` bundle the
same six skills and preserve the HTTP connection without Claude-plugin conversion.

### Claude Desktop and claude.ai

Open **Customize**, then **Connectors**, choose **Add** and then **Add custom
connector**. Name it, paste `https://databricks.techfabric.com/mcp`, keep the
authentication settings Claude detects, and choose **Add**. On a Team or
Enterprise plan, an owner may have to add the connector for the organisation
first.

### ChatGPT

At [chatgpt.com/plugins](https://chatgpt.com/plugins), choose **+** and then
**Add custom MCP server**. Paste the URL under **Connection**, choose no
authentication, and create it. In a chat, type `@` and pick it. If **Add custom
MCP server** isn't there, your workspace's admin has to turn it on.

### Codex

```sh
codex mcp add databricks-field-guide --url https://databricks.techfabric.com/mcp
```

Or by hand, in `~/.codex/config.toml`:

```toml
[mcp_servers.databricks-field-guide]
url = "https://databricks.techfabric.com/mcp"
```

### Cursor

In `~/.cursor/mcp.json` for every project, or `.cursor/mcp.json` for one:

```json
{
  "mcpServers": {
    "databricks-field-guide": { "url": "https://databricks.techfabric.com/mcp" }
  }
}
```

### VS Code

In `.vscode/mcp.json`, then start it from that file or the MCP view. The tools
show up in Copilot's agent mode.

```json
{
  "servers": {
    "databricks-field-guide": { "type": "http", "url": "https://databricks.techfabric.com/mcp" }
  }
}
```

### GitHub Copilot

In VS Code, use the configuration above. Copilot CLI saves the server to
`~/.copilot/mcp-config.json`, for every project:

```sh
copilot mcp add --transport http databricks-field-guide https://databricks.techfabric.com/mcp
```

Copilot's coding agent on github.com takes it in the repository's
**Settings**, under **Copilot** and **MCP servers**.
Every tool is read-only, so it can have all of them:

```json
{
  "mcpServers": {
    "databricks-field-guide": {
      "type": "http",
      "url": "https://databricks.techfabric.com/mcp",
      "tools": ["*"]
    }
  }
}
```

### Anything else

Point the client at the URL with the Streamable HTTP transport and no
authentication. A client that only speaks stdio can reach it through
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```sh
npx mcp-remote https://databricks.techfabric.com/mcp
```

Gemini CLI and OpenCode each have their own line in the
[setup guide](https://www.techfabric.com/mcp-servers#connect).

## Tools

| Tool | What it does |
| --- | --- |
| `start_here` | Starts a working diagnostic, a named concept lesson or certification practice, with an Apps card and text fallback |
| `search_guide` | Finds the chapter sections, margin notes and events that answer a Databricks question, best first, each with its URL and section anchor |
| `get_chapter` | Reads a chapter, a margin note or one section of either as Markdown, with code, FAQs and the docs.databricks.com links it cites |
| `get_code_examples` | Returns the SQL, Python, CLI and config blocks that match a topic, with the explanation around each one |
| `whats_new` | Lists recent Databricks changes the guide tracks, newest first: margin notes, release-stage changes and updated chapters |
| `list_chapters` | The table of contents, with each chapter's part, summary, dates and main sections |
| `review_databricks_code` | Checks one SQL, Python or YAML file (a bundle, job, cluster or warehouse config) against the guide's own rules. Each finding gives the line, why, the fix, the guide's sentence with its section URL and the docs it cites, and the result lists the sections worth reading |
| `estimate_cost` | Estimates a workload's monthly cost from the figures the guide states, as a range with its assumptions. Every number carries its source sentence, section URL, date and pricing page, and where the guide has no figure it says so instead of guessing |
| `explore_concept` | Opens a guided, interactive concept walkthrough |
| `quiz_me` | Asks sourced questions and scores the reader's actual answers |
| `learn_path` | Provides role-based learning steps and checks progress supplied by the reader |
| `exam_prep` | Maps certification domains to guide coverage and official exam guides |
| `flashcards` | Practices sourced terms by chapter or exam domain |
| `visualize` | Builds a guide-grounded diagram or chart |
| `decide` | Compares engineering choices from the guide's stated trade-offs |
| `explore_diagram` | Opens an interactive walkthrough of a chapter diagram |
| `toolkit_info` | Says what TechFabric's free Chrome extension for Databricks (the [TechFabric Toolkit for Databricks](https://chromewebstore.google.com/detail/techfabric-toolkit-for-da/lhlcbhfedpapiijjkgbgecciiponhlgo)) does, feature by feature: where each shows up, whether it needs your connected workspace, and the tool here that does the same; plus install, permissions and privacy |
| `toolkit_generate` | Runs the extension's offline generators with its own code: Unity Catalog grants with rollback, table DDL and MERGE, bundle YAML and CLI, Terraform, Auto Loader, Lakeflow and CDC starters, data-quality checks, cost SQL, an error decoder, a pre-flight check for destructive SQL, MLflow and serving templates, and its snippet libraries |

All eighteen are read-only, and none calls a model: the review and the estimate are
deterministic checks against the guide's text, the toolkit's generators run the
extension's own code, and your agent does the reasoning. A rule applies only while the guide still says what it cites. The
rules leave out what the guide doesn't argue, such as `SELECT *` or `collect()`
on their own.

Three resources come with them: `fieldguide://llms.txt`, one line per page;
`fieldguide://whats-new`, the last 30 days of changes as JSON; and
`fieldguide://page/{+path}`, any published page as Markdown. Hosts that render
[MCP Apps](https://modelcontextprotocol.io/) show the results as an interactive
view instead of plain text: since 1.3.0 that includes the review's findings and
the estimate as a table.

## Prompts

Hosts that support MCP prompts show these as slash commands. In Claude Code
they're `/mcp__databricks-field-guide__<name>`.

| Prompt | What it does |
| --- | --- |
| `start` | Starts a first learning or certification session |
| `learn` | Teaches a topic with guide sections and practice |
| `quiz` | Runs a sourced quiz one question at a time |
| `explain` | Opens an interactive concept explanation |
| `path` | Starts a role-based learning path |
| `exam` | Prepares a certification's domain map and practice |
| `flashcards` | Starts a recall deck |
| `estimate` | Estimates a named workload's cost from cited rates |
| `databricks-review` | Reviews this repository's Databricks setup against the guide. Your agent collects the bundles, notebooks, SQL and compute configs, runs `review_databricks_code` on each and summarises the findings with links |
| `databricks-cost` | Estimates what the repository's workloads cost with `estimate_cost`, with every figure's source and date and the gaps stated plainly |
| `whats-new` | Summarises what Databricks changed lately and which of it touches this repository |
| `field-guide-chapter` | Puts a chapter, or one section of it, into the conversation as Markdown |
| `field-guide-code` | Finds the guide's code examples for a topic, optionally from one chapter |

Chapter and section arguments complete as you type, and so does the page
resource's path. MCP completes prompt arguments, not tool arguments, so these
prompts are where `get_chapter`'s chapter names complete.

## Notifications

On MCP 2026-07-28 a client can subscribe with `subscriptions/listen` to
`fieldguide://whats-new` or any `fieldguide://page/...`. When a deploy of the
guide changes a subscribed resource, such as a new margin note, a rewritten
chapter or a feature moving release stage, the server sends
`notifications/resources/updated`. Clients on 2025-11-25 have no stream to push
on, so they read `whats_new` instead.

Every answer says when its page last changed and how long a client may cache
it: 10 minutes for what's new, 15 for search and an hour for chapters and code.
The index is rebuilt on every deploy of the guide.

## Things to ask

- "Help me learn Databricks. Start with a short diagnostic."
- "Help me prepare for Data Engineer Associate. Start practice now."
- "Explain Unity Catalog interactively, then check my understanding."
- "How do I add a Unity Catalog row filter? Use the Databricks Field Guide."
- "What changed in Databricks in the last two weeks?"
- "Get the Field Guide's SQL for a Unity Catalog column mask and apply it to
  the email column in my customers table."
- "Read the Field Guide's Lakebase chapter and tell me whether branching fits
  our test environments."
- "What does the Field Guide say about choosing compute to cut our Databricks
  bill?"
- "Review this repo's Databricks bundle against the Field Guide." Or run
  `/mcp__databricks-field-guide__databricks-review` in Claude Code.
- "Estimate what a Medium Databricks App costs running office hours, using the
  Field Guide's figures."
- "Check `pipelines/orders.sql` against the Field Guide and fix what it flags."

## Sign-in, limits and privacy

From an installed plugin directory, `node scripts/doctor.mjs` checks anonymous
discovery, portable schemas, a working diagnostic, certification practice and
the Apps resource. Node.js 20 or newer is required. This is a connection check,
not proof that a particular host renders cards.

Practice comes from the guide, not real exam questions. Coverage gaps are shown;
verify requirements against the linked official exam guide. The Field Guide is
independent of Databricks and cannot guarantee a certification result or complete,
up-to-the-minute platform coverage. Missing answers should be checked in official
documentation. Progress stays in the conversation unless you ask to save it.
Review skills ask before sending repository code; share only approved, sanitized
files, without secrets or customer data.

There's no sign-in and no write tool. Each IP address gets 60 calls a minute
and 300 an hour; past that the server answers HTTP 429 with a `Retry-After`
header.

The server doesn't keep what you searched for or read, or the code you send
to `review_databricks_code`. A finding that quotes a line masks any secret on
it. The server's log line for a call names the tool and the protocol revision,
never the arguments. It stores two things: the per-IP call count, which expires
after about an hour, and one record per deploy of what changed, for
notifications. It makes no outbound request. The site's
[privacy policy](https://www.techfabric.com/privacy-policy) covers the rest.

It speaks MCP revision 2026-07-28, and clients still on 2025-11-25 are served on
the same URL. In the official registry it's
`com.techfabric.databricks/field-guide`.

## Links

- [The Databricks Field Guide](https://databricks.techfabric.com)
- [The Field Guide MCP server's documentation](https://www.techfabric.com/mcp-servers#field-guide): every tool, resource and limit, and the setup for each client
- [The official MCP Registry entry](https://registry.modelcontextprotocol.io/v0.1/servers/com.techfabric.databricks%2Ffield-guide/versions/latest)
- [The techfabric.com MCP server](https://github.com/Fabric-Pro/techfabric-mcp)
- [TechFabric's Databricks consulting](https://www.techfabric.com/databricks)
- [Talk to an engineer](https://www.techfabric.com/contact)

## License

The files in this repository are under the [Apache License 2.0](LICENSE),
copyright Tech Fabric LLC. The Field Guide's content and the server itself
aren't covered by it.
