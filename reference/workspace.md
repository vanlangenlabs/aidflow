# `.air/README.md` template

Initialize the project workspace with this notice, preserving any additional
project instructions that do not conflict with [`airflow.md`](../airflow.md):

```markdown
# AIRFlow project workspace

This directory contains AI-managed project records used by AIRFlow. It is not a
general-purpose documentation folder.

Do not edit these records directly. Ask the AIRFlow agent to update them through
the workflow, then review and approve proposed changes before they are merged.

Do not store secrets or credentials here.
```

# `.air/index.md` inventory and resume template

The index is the canonical inventory and resume point, not a copy of the records.
Use this structure and keep detailed content in its individual files:

Use stable project-local IDs: `F-0001` for features, the user-visible version string
(for example `1.2.0`) for releases, and `A-0001` for approval/change events. Never
reuse an ID.

```markdown
# AIRFlow project index

## Workflow source
- entry: <airflow.md source URL or repository-relative path>

| Source path | Role | Ref (commit/tag) | SHA-256 |
| --- | --- | --- | --- |
| <airflow.md, Project and each subflow used> | <source role> | <immutable ref or unpinned> | <digest or unknown> |

## Tracker integration
- provider: <none|github|gitlab>
- project_or_board: <reference or none>

## Current execution
- status: <ready|running|waiting-human|blocked|complete>
- phase: <stable subflow ID>
- node_id: <stable Mermaid node ID>
- call_stack: <caller node -> subflow node -> current node>
- call_arguments: <feature/release mode, target IDs, new-work/rework, findings>
- pending_targets: <affected feature IDs in dependency order or none>
- feature_id: <ID or none>
- release_id: <version or none>
- next_action: <specific action, decision or evidence needed>

## Records
| ID | Type | Path | record_status | Current SHA-256 | Approved SHA-256 | Depends on | Tracker reference |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Features
| Feature ID | Definition record ID | feature_status | Active release ID or none | Prior status if blocked | Event reference |
| --- | --- | --- | --- | --- | --- |

## Releases
| Release ID | Scope record ID | Design record ID or none | release_status | Prior status if blocked | Event reference |
| --- | --- | --- | --- | --- | --- |

Record IDs are unique across Records. Feature and release IDs identify their own
entity tables and reference Records by ID; do not duplicate lifecycle statuses in
Records or content files. Use `none` only for explicitly non-applicable fields.

## Approval and change events
| Event ID | Kind: decision/change | Record/entity | Old/new SHA-256 | Decision or change classification | Actor | Timestamp | Evidence and rationale | Affected records/checks/events | Next state |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Verification evidence
| Feature/release | Check | Result | Evidence path/reference | Digest | Current/stale and reason |
| --- | --- | --- | --- | --- | --- |
```

Use stable node IDs in every Mermaid flow and keep them stable across compatible
workflow revisions. If an ID must change, document an old-to-new mapping in the new
workflow version. Store the source-level Mermaid ID (for example `definitionApproval`),
not a generated SVG DOM ID whose numeric suffix can change when nodes are inserted.
Use `unknown` or `none` where the information is genuinely unavailable; never fill
a field from assumption.
