# AIDFlow Repository Setup

Use this file once to set up a repository for AIDFlow, for example from a GitHub
Copilot Jumpstart prompt or a pasted instruction. Setup copies the method into the
repository as a pinned, local version. After setup, work from that copy and not from
the online sources. If a source is inaccessible, report the blocker and ask for an
accessible copy; do not invent its contents.

Do not assume or invent a product name, project idea, users, requirements or
technical choices. Do not implement product code or approve records on the
user's behalf.

## Run setup only once

Before changing anything, check whether this repository is already set up or setup
is already in progress: `.aidflow/method/` or `.aidflow/index.md` exists, or an open
pull request or branch already sets up AIDFlow. If so, do not start a second setup
and do not open another pull request. Report where the existing setup is and,
if it waits for an answer, point to that pull request and stop. Replacing the method
is a version change that needs the user's authorization.

## Setup steps

1. Resolve the source to one immutable commit of `vanlangenlabs/aidflow` (for
   example from `https://api.github.com/repos/vanlangenlabs/aidflow/commits/main`).
   Read every file below from `https://raw.githubusercontent.com/vanlangenlabs/aidflow/<commit>/<path>`. If a commit cannot be
   resolved, use `main` once, record `unpinned`, and never mix versions.
2. Create `.aidflow/method/` and save an exact, unmodified copy of these files,
   keeping their relative paths:
   - `aidflow.md`
   - `flows/`: `concept.mmd`, `definition.mmd`, `design.mmd`, `feature-intake.mmd`, `implementation.mmd`, `project.mmd`, `release-planning.mmd`, `verification.mmd`
   - `reference/`: `approvals.md`, `concept-example.md`, `interaction-record.md`, `interaction.md`, `release-lifecycle.md`, `resume.md`, `statuses.md`, `workspace.md`

   Never edit the copy. It is the pinned method version for this repository;
   replacing it is a version change that needs the user's authorization.
3. Create `.github/copilot-instructions.md` (or the agent's own instruction file,
   such as `AGENTS.md` or `CLAUDE.md`) with the reference below, preserving any
   existing instructions.

   ```markdown
   # AIDFlow

   For development work, read and follow `.aidflow/method/aidflow.md` before acting or
   resuming. If that file does not exist yet, first read and follow
   https://raw.githubusercontent.com/vanlangenlabs/aidflow/main/setup.md.
   If a source is inaccessible, report the limitation and request an accessible copy; do not guess.
   ```

4. Read `.aidflow/method/aidflow.md` and follow its Project entry point. Initialize
   `.aidflow/` administration and the project output documents in `docs/aidflow/`
   as it directs, preserving existing files. The Concept, feature Definitions,
   release scopes and Designs are the only workflow outputs placed in `docs/`;
   keep the pinned method, flows, references and workflow state in `.aidflow/`.
   Register output document paths and digests, and every copied method file with
   its source commit and SHA-256, in `.aidflow/index.md`.
5. Start the Concept Question interaction. When working asynchronously (for
   example as the Copilot coding agent), post it in a pull request comment titled
   "Questions for the project owner"; do not put the questions only in the pull
   request description, and if you cannot post a comment, state that limitation
   in the pull request and stop. In an interactive session, ask directly.
   - If the project purpose is not already clear, first ask what the project
     should do or what problem it should solve.
   - Follow the Question protocol and `.aidflow/method/reference/concept-example.md`
     to identify other missing information. Ask only focused questions needed to
     fill `docs/aidflow/concept.md`.
6. Record the unanswered questions and next action as a pending interaction in
   `.aidflow/index.md`.
7. Explain the setup changes, checks performed and how to resume in the pull
   request.
8. Tell the user to include `@copilot` in every pull request comment whose answer
   or instruction should be processed. Several answers may be bundled in one
   comment. A plain reply may not start or resume a task. Repeat this reminder
   for follow-up questions.
9. Do not continue until the user responds. When working asynchronously, end
   the task after asking.

## After the user answers

Resume from `.aidflow/index.md`. Use the answers to draft `docs/aidflow/concept.md`
and present that exact version for review and explicit approval. Keep unresolved
questions visible. Do not begin feature intake or implementation until the
concept is approved.
