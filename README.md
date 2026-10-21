<p align="center">
  <img src="icon.png" alt="TechFabric mark" width="96" height="96">
</p>

# Databricks Field Guide MCP server

Coding agents write Databricks code from training data that's months old. The
[Databricks Field Guide](https://databricks.techfabric.com) is what
TechFabric's engineers know about building, running and paying for Databricks,
and its MCP server hands your agent the section that answers the question, with
code that runs and the docs.databricks.com pages that section cites.

```
https://databricks.techfabric.com/mcp
```

It's a remote server over Streamable HTTP, so there's nothing to install. It's
read-only, it needs no sign-in, and it's free.

Ask how to add a Unity Catalog row filter, and the agent gets the guide's
section on it, the SQL function from that section and the Databricks
documentation behind it. Databricks' own docs stay the authority on syntax and
limits, which is why every answer links to them.

This isn't Databricks' own MCP server. Databricks runs managed MCP servers
inside a workspace that act on your data. This one is built and run by
[TechFabric](https://www.techfabric.com/databricks), a Databricks partner, and
it never connects to a workspace.

## What's in this repository

Descriptor files, so MCP directories have a repository to list. The server's
code isn't here and isn't open source.

| File | What it is |
| --- | --- |
| `server.json` | The server's entry in the [official MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers/com.techfabric.databricks%2Ffield-guide/versions/latest), copied as published |
| `glama.json` | Maintainer list for [Glama](https://glama.ai/mcp/connectors/com.techfabric.databricks/field-guide) |
| `icon.png`, `icon-light.png` | The TechFabric mark at 256 px, for dark and light backgrounds |
| `LICENSE` | Apache-2.0, for these files only |

The live server and the registry are the source of truth. If this README and
the server's `tools/list` ever disagree, the server is right. A weekly GitHub
Action compares `server.json` with the registry and opens a pull request when
the entry has changed.

## Add it to your agent

### Claude Code

```sh
claude mcp add --transport http databricks-field-guide https://databricks.techfabric.com/mcp
```

Add `--scope user` to have it in every project.

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

### Anything else

Point the client at the URL with the Streamable HTTP transport and no
authentication. A client that only speaks stdio can reach it through
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```sh
npx mcp-remote https://databricks.techfabric.com/mcp
```

Gemini CLI, GitHub Copilot CLI and OpenCode each have their own line in the
[setup guide](https://www.techfabric.com/mcp-servers#connect).

## Tools

| Tool | What it does |
| --- | --- |
| `search_guide` | Finds the chapter sections, margin notes and events that answer a Databricks question, best first, each with its URL and section anchor |
| `get_chapter` | Reads a chapter, a margin note or one section of either as Markdown, with code, FAQs and the docs.databricks.com links it cites |
| `get_code_examples` | Returns the SQL, Python, CLI and config blocks that match a topic, with the explanation around each one |
| `whats_new` | Lists recent Databricks changes the guide tracks, newest first: margin notes, release-stage changes and updated chapters |
| `list_chapters` | The table of contents, with each chapter's part, summary, dates and main sections |

Two resources come with them: `fieldguide://llms.txt`, one line per page, and
`fieldguide://page/{+path}`, any published page as Markdown. Since version
1.2.0, hosts that render [MCP Apps](https://modelcontextprotocol.io/) show the
results as an interactive view instead of plain text.

Every answer says when its page last changed and how long a client may cache
it: 10 minutes for what's new, 15 for search and an hour for chapters and code.
The index is rebuilt on every deploy of the guide.

## Things to ask

- "How do I add a Unity Catalog row filter? Use the Databricks Field Guide."
- "What changed in Databricks in the last two weeks?"
- "Get the Field Guide's SQL for a Unity Catalog column mask and apply it to
  the email column in my customers table."
- "Read the Field Guide's Lakebase chapter and tell me whether branching fits
  our test environments."
- "What does the Field Guide say about choosing compute to cut our Databricks
  bill?"

## Sign-in, limits and privacy

There's no sign-in and no write tool. Each IP address gets 60 calls a minute
and 300 an hour; past that the server answers HTTP 429 with a `Retry-After`
header.

The server doesn't keep what you searched for or read. Its log line for a call
names the tool and the protocol revision, never the arguments. The only thing
stored is the per-IP call count, which expires after about an hour, and the
server makes no outbound request. The site's
[privacy policy](https://www.techfabric.com/privacy-policy) covers the rest.

It speaks MCP revision 2026-07-28, and clients still on 2025-11-25 are served on
the same URL. In the official registry it's
`com.techfabric.databricks/field-guide`.

## Links

- [The Databricks Field Guide](https://databricks.techfabric.com)
- [Setup guide for both TechFabric MCP servers](https://www.techfabric.com/mcp-servers)
- [The techfabric.com MCP server](https://github.com/Fabric-Pro/techfabric-mcp)
- [TechFabric's Databricks consulting](https://www.techfabric.com/databricks)
- [Talk to an engineer](https://www.techfabric.com/contact)

## License

The files in this repository are under the [Apache License 2.0](LICENSE),
copyright Tech Fabric LLC. The Field Guide's content and the server itself
aren't covered by it.
