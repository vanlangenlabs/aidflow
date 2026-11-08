# Resume validation

Before resuming, verify all of the following against the current files:

1. Workflow source/ref matches the recorded version. Prefer an immutable commit or
   tag. If the source is unpinned, compare the recorded digests of `airflow.md` and exact Mermaid files used.
2. The recorded subflow, node ID and call stack exist in that workflow version and
   form a valid path from Project.
3. Each active record path exists and its current digest matches the index. If a
   digest changed, classify it using Change handling in [`airflow.md`](../airflow.md); do not assume approval or
   corruption. Update the index with a change event only when its origin and impact
   are clear; otherwise block and ask.
4. Approval evidence matches the current digest or has a documented editorial
   derivation. Verification evidence is current for the current feature/design.
5. The index, records and optional tracker do not have an unresolved conflict.

If a record/index check fails, set execution status to `blocked`, list the exact
mismatch and ask how to reconcile it. Do not skip nodes, reconstruct missing
approvals, or infer current state from a tracker, branch name, issue order or artifact.

If the shared workflow version changed, do not silently replace the recorded ref.
Compare old and new sources and any node-ID migration map. A user must authorize
resuming under the new version. Set execution to `waiting-human` during this decision.
Preserve the old ref and record a migration event.
If transition, criteria or approval-gate semantics changed, invalidate dependent
approvals/evidence and resume at the earliest affected state. If compatibility is
unclear, remain blocked and ask.
