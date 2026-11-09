# Workflow migration

Read this only when the shared workflow version changed (see [resume validation](resume.md)). It lists node-ID and status reconciliations between workflow revisions. Do not use it for an unchanged version.

## Workflow revision: explicit orchestration and self-review

This revision changes transition semantics. Existing runs must follow
`reference/resume.md` and receive user authorization before changing versions.
Retain the old source and call stack until the pending work is reconciled.

- Old position; New position / required reconciliation
- Project start -> concept; restore; validate saved position or current Concept approval
- Verification implementation; Project implementation; preserve target and repair findings
- Verification definition; Project definition; preserve target and proposed change
- Verification releasePlanning; Project releasePlanning; preserve impact and decision evidence
- Verification design / designForChangedDefinition; Project design; preserve required reapproval
- Verification impact / scopeImpact / designImpact; Corresponding Project node; preserve impact evidence
- Verification moreUnverified; Project select; inspect current feature evidence
- Verification releaseDiagnosis / releaseRootCause; Verification diagnosis / rootCause in release mode
- Verification testing / featureChecksPassed; Same node in feature mode; add explicit target
- Verification releaseChecks / releaseChecksPassed; Same node in release mode; validate feature evidence
- Implementation start / plan; Same node with explicit feature ID and new-work/rework mode
- Design review; Same node, followed by mandatory quality decision
- Definition specify; Same node, followed by mandatory self-review
- Project releaseApproval / awaitingPublication; Same node; successful authorization leads to publish

Other retained IDs do not by themselves establish semantic compatibility. Remove
obsolete nested repair frames only after reconciling their pending outcome with
Project. Never infer approval or publication success from migration. Re-evaluate
only evidence affected by changed criteria; block when mapping is ambiguous.

### Status ownership revision

Split legacy combined inventory status columns into Records (`record_status`),
Features (`feature_status`) and Releases (`release_status`). Keep content files
free of mutable statuses. Migrate one release status per version from evidence;
never interpret Design `approved` as release `published` or record approval as
release lifecycle. Preserve historical events. Conflicting legacy statuses require
reconciliation before resuming. Apply the user-authorized version
migration rules in `reference/resume.md`; do not silently migrate an active run.

### Input-wait and source-registration revision
Definition and Design now retain missing product decisions at awaitingInput,
with interaction awaiting-input and execution waiting-human. Their quality and
blocked IDs are retained; blocked is reserved for actual obstacles/conflicts.
For an old Definition/Design blocked frame caused only by a missing answer,
map that frame to the same subflow awaitingInput after user-authorized migration.
Preserve its question and caller stack; remove only caller blocked frames that
propagated that same missing-answer outcome. Real blockers stay blocked.
Register used reference files alongside flows and reconcile legacy index
self-records through reference/resume.md; do not invent historical digests.
