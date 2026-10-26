#!/usr/bin/env node
/**
 * Anonymous connection checks, not a claim that a particular host renders Apps.
 * heddle: pending #217
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT = "https://databricks.techfabric.com/mcp";
const REQUIRED = ["start_here", "search_guide", "get_chapter", "explore_concept", "quiz_me", "learn_path", "exam_prep", "flashcards", "review_databricks_code", "estimate_cost"];

export function checkInputSchema(schema, path = "input") {
  if (!schema || typeof schema !== "object") return;
  if (Array.isArray(schema.type)) throw new Error(`${path} uses type[]; this is incompatible with some model providers`);
  for (const [key, value] of Object.entries(schema)) checkInputSchema(value, `${path}.${key}`);
}

export async function diagnose(endpoint = DEFAULT, { fetcher = fetch } = {}) {
  const url = new URL(endpoint);
  const local = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || !(url.protocol === "https:" || local && url.protocol === "http:")) throw new Error("Use an HTTPS endpoint without credentials, query or fragment, or an HTTP loopback endpoint for local testing.");
  let id = 0;
  const rpc = async (method, params) => {
    const res = await fetcher(url.href, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-11-25" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`${method}: HTTP ${res.status}. The public Field Guide should not ask for sign-in.`);
    const raw = await res.text();
    const result = raw.trim().startsWith("{") ? JSON.parse(raw) : JSON.parse(raw.split("\n").filter(l => l.startsWith("data:")).at(-1)?.slice(5) ?? "{}");
    if (result.error) throw new Error(`${method}: ${result.error.message}`);
    if (!result.result || typeof result.result !== "object") throw new Error(`${method}: missing MCP result`);
    if (result.result.isError) throw new Error(`${method}: ${result.result.content?.[0]?.text ?? "tool failed"}`);
    return result.result;
  };
  const init = await rpc("initialize", {
    protocolVersion: "2025-11-25", clientInfo: { name: "field-guide-doctor", version: "1.8.0" },
    capabilities: { extensions: { "io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] } } },
  });
  const { tools } = await rpc("tools/list", {});
  for (const name of REQUIRED) if (!tools?.some(t => t.name === name)) throw new Error(`Missing ${name}. Refresh the connector's tools or reconnect.`);
  for (const tool of tools) {
    checkInputSchema(tool.inputSchema, tool.name);
    if (tool.annotations?.readOnlyHint !== true || tool.securitySchemes?.some(s => s.type !== "noauth")) throw new Error(`${tool.name} unexpectedly requires authentication or writes data`);
  }
  const lesson = await rpc("tools/call", { name: "start_here", arguments: {} });
  if (!lesson.structuredContent?.questions?.length) throw new Error("The starter did not return a working diagnostic");
  const certification = await rpc("tools/call", { name: "start_here", arguments: { goal: "certification", exam: "data-engineer-associate" } });
  if (!certification.structuredContent?.practice?.questions?.length) throw new Error("Certification practice did not start");
  const uri = tools.find(t => t.name === "start_here")._meta?.ui?.resourceUri;
  if (!uri || !init.capabilities?.extensions?.["io.modelcontextprotocol/ui"]) throw new Error("MCP Apps support is missing");
  const resource = await rpc("resources/read", { uri });
  if (!resource.contents?.some(c => c.mimeType === "text/html;profile=mcp-app" && c.text?.includes("<html"))) throw new Error("The learning view resource is missing");
  return {
    status: "PASS", endpoint: url.href, server: init.serverInfo, tools: tools.length,
    anonymous: true, schemas: "portable",
    diagnostic: { questions: lesson.structuredContent.questions.length },
    certification: { exam: certification.structuredContent.exam, domain: certification.structuredContent.domain, questions: certification.structuredContent.practice.questions.length },
    apps: { advertised: true, resourceReadable: true, hostRendering: "Not tested by this connection check" },
    try: "Help me learn Databricks. Start with a short diagnostic.",
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length && !(args.length === 2 && args[0] === "--url")) throw new Error("Usage: node scripts/doctor.mjs [--url https://host/mcp]");
    console.log(JSON.stringify(await diagnose(args[1]), null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: "FAIL", message: error.message, next: "Check the endpoint, reconnect or refresh tools, then try again. Public learning needs no sign-in." }, null, 2));
    process.exitCode = 1;
  }
}
