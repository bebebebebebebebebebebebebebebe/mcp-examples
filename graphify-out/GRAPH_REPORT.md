# Graph Report - .  (2026-08-18)

## Corpus Check
- Corpus is ~20,032 words - fits in a single context window. You may not need a graph.

## Summary
- 145 nodes · 174 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- User API Data Models
- Application and MCP Runtime
- Development Toolchain Dependencies
- Runtime Framework Dependencies
- TypeScript Compiler Configuration
- Agent and Graphify Documentation
- Package Scripts and Metadata
- MCP Preview Lifecycle
- MCP Client Initialization
- Cloudflare Worker Setup

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 11 edges
2. `Graphify Knowledge Graph Pipeline` - 9 edges
3. `scripts` - 8 edges
4. `UserNotFoundError` - 4 edges
5. `ExternalApiError` - 4 edges
6. `Incremental Graph Update` - 4 edges
7. `createStructuredLoggerMiddleware()` - 3 edges
8. `getUsersQuerySchema` - 3 edges
9. `getUserByIdParamsSchema` - 3 edges
10. `getUsers()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Codebase Onboarding Engineer` --semantically_similar_to--> `Graph Query Traversal`  [INFERRED] [semantically similar]
  .agents/engineering-codebase-onboarding-engineer.md → .codex/skills/graphify/references/query.md
- `DevOps Automator` --conceptually_related_to--> `Post-Commit Graph Hook`  [INFERRED]
  .agents/engineering-devops-automator.md → .codex/skills/graphify/references/hooks.md
- `Graphify Project Integration Rules` --references--> `Graphify Knowledge Graph Pipeline`  [EXTRACTED]
  AGENTS.md → .codex/skills/graphify/SKILL.md
- `Graphify Project Integration Rules` --references--> `Graph Query Traversal`  [EXTRACTED]
  AGENTS.md → .codex/skills/graphify/references/query.md
- `Graphify Project Integration Rules` --references--> `Incremental Graph Update`  [EXTRACTED]
  AGENTS.md → .codex/skills/graphify/references/update.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Reliability and Guardrail Architecture** — _agents_engineering_autonomous_optimization_architect_autonomous_optimization_architect, _agents_engineering_backend_architect_backend_architect, _agents_engineering_devops_automator_devops_automator, _agents_security_architect_security_architect [INFERRED 0.85]
- **Automated Graph Maintenance** — _codex_skills_graphify_references_add_watch_url_ingestion_and_watch, _codex_skills_graphify_references_hooks_post_commit_graph_hook, _codex_skills_graphify_references_update_incremental_graph_update [INFERRED 0.95]

## Communities (12 total, 1 thin omitted)

### Community 0 - "User API Data Models"
Cohesion: 0.10
Nodes (25): Address, addressSchema, Company, companySchema, GeoLocation, geoLocationSchema, GetUserByIdParams, getUserByIdParamsSchema (+17 more)

### Community 1 - "Application and MCP Runtime"
Cohesion: 0.12
Nodes (14): apiRoot, AppContext, renderer, AppLogger, createStructuredLogger(), createStructuredLoggerMiddleware(), LogLevel, LogPayload (+6 more)

### Community 2 - "Development Toolchain Dependencies"
Cohesion: 0.10
Nodes (21): @cloudflare/vite-plugin, eslint, @eslint/js, devDependencies, @cloudflare/vite-plugin, eslint, @eslint/js, @types/bun (+13 more)

### Community 3 - "Runtime Framework Dependencies"
Cohesion: 0.12
Nodes (17): better-auth, hono, @hono/structured-logger, @hono/zod-validator, @modelcontextprotocol/client, @modelcontextprotocol/hono, @modelcontextprotocol/server, dependencies (+9 more)

### Community 4 - "TypeScript Compiler Configuration"
Cohesion: 0.12
Nodes (15): bun, DOM, ESNext, vite/client, compilerOptions, jsx, jsxImportSource, lib (+7 more)

### Community 5 - "Agent and Graphify Documentation"
Cohesion: 0.19
Nodes (15): Autonomous Optimization Architect, Backend Architect, Codebase Onboarding Engineer, DevOps Automator, Security Architect, URL Ingestion and Folder Watch, Graph Export Formats, Graph Extraction Specification (+7 more)

### Community 6 - "Package Scripts and Metadata"
Cohesion: 0.18
Nodes (10): name, scripts, build, cf-typegen, deploy, dev, mcp:preview, preview (+2 more)

### Community 7 - "MCP Preview Lifecycle"
Cohesion: 0.67
Nodes (3): cleanup(), mcp-preview.sh script, shutdown()

### Community 8 - "MCP Client Initialization"
Cohesion: 0.67
Nodes (3): CreateMcpClientOptions, initMcpClient(), main()

## Knowledge Gaps
- **64 isolated node(s):** `name`, `type`, `dev`, `build`, `test` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Development Toolchain Dependencies` to `Package Scripts and Metadata`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Framework Dependencies` to `Package Scripts and Metadata`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `name`, `type`, `dev` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `User API Data Models` be split into smaller, more focused modules?**
  _Cohesion score 0.09879032258064516 - nodes in this community are weakly interconnected._
- **Should `Application and MCP Runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Should `Development Toolchain Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Runtime Framework Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._