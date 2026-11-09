# Migrating an existing project to AIDFlow

New projects use `aidflow.md`, `.aidflow/` and the `@aidflow-context` /
`@end-aidflow-context` markers. Existing AIRFlow projects must migrate explicitly;
do not initialize an empty workspace beside their existing `.air/` records.

1. Save the current workspace and workflow source in version control or an
   equivalent recoverable copy. Inspect existing `.air/` and `.aidflow/` folders.
   If both exist, stop and reconcile their contents with the owner; never merge
   them automatically or overwrite either workspace.
2. Follow the recorded workflow's migration rules and obtain human authorization
   for the new source version. Record the old and new immutable source refs and
   the workspace path mapping `.air/` -> `.aidflow/`. Preserve stable record,
   feature, release and event IDs, current nodes, pending questions and call stacks.
3. Move the existing workspace to `.aidflow/` without changing record contents.
   An unchanged file retains its digest after moving. Update active path pointers
   in the index and repository instructions to the new workspace and `aidflow.md`.
   Preserve historical approval events, quotes, source refs and digests verbatim;
   interpret their old paths through the recorded migration mapping.
4. If active record contents contain old paths that must change, classify each
   edit under AIDFlow's change rules. Recompute its digest and document any
   editorial derivation; material changes require renewed review and approval.
   Renaming alone never grants or restores an approval.
5. Validate the new source manifest, record digests, dependencies, evidence and
   saved execution position using [resume validation](reference/resume.md).
   Register used reference files. Use the new source's node migration map where
   needed; do not treat the rename as proof that all workflow semantics match.
6. Resume only when those checks pass. Keep historical versions accessible;
   do not retain a second active `.air/` workspace.

When reading a pinned historical source, its original filename and context markers
remain authoritative for that version. The current viewer uses the new markers;
do not mix old diagram sources with the new method version.
