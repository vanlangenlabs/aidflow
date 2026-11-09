# Resume validation

Before resuming, verify all of the following against the current files:

1. Workflow source/ref matches the recorded version. Check every registered method
   file: `airflow.md`, Project, used subflows and used `reference/*.md`. Verify
   available recorded digests against the exact bytes, including for pinned sources.
   For an unpinned source, compare every registered digest with the current source
   before resuming. A missing digest or unavailable old source is an unresolved
   consistency check, not permission to assume compatibility. Load any newly
   needed file from the same recorded version, following
   [workflow source registration](workspace.md#workflow-source-registration).
2. The recorded subflow, node ID and call stack exist in that workflow version and
   form a valid path from Project.
3. Each active record path exists and its current digest matches the index. If a
   digest changed, classify it using Change handling in [`airflow.md`](../airflow.md); do not assume approval or
   corruption. Update the index with a change event only when its origin and impact
   are clear; otherwise block and ask.
4. Approval evidence matches the current digest or has a documented editorial
   derivation. Verification evidence is current for the current feature/design.
5. The index, records and optional tracker do not have an unresolved conflict.

Do not try to validate a self-digest for `.air/index.md`. Validate its structure,
record references and evidence instead. If an older index contains a self-record,
remove that row as an operational correction, preserve history and any referenced
events, and record the correction; never infer approval from its old digest.

If a source, record or index check cannot be completed, set execution status to `blocked`, list the exact
mismatch and ask how to reconcile it. Do not skip nodes, reconstruct missing
approvals, or infer current state from a tracker, branch name, issue order or artifact.

If the shared workflow version changed, do not silently replace the recorded ref.
Compare old and new sources, including changed reference rules, and any node-ID
migration map. A user must authorize
resuming under the new version. Set execution to `waiting-human` during this decision.
Preserve the old ref and record a migration event.
If transition, criteria or approval-gate semantics changed, invalidate dependent
approvals/evidence and resume at the earliest affected state. If compatibility is
unclear, remain blocked and ask.
