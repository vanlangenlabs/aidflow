# AIDFlow Repository Setup

Use this file once to set up a new repository for AIDFlow, for example from a
GitHub Copilot Jumpstart prompt. After setup, [aidflow.md](aidflow.md) governs
all development work. Resolve links relative to this file's source URL and keep
all AIDFlow sources on the same version. If a source is inaccessible, report the
blocker and ask for an accessible copy; do not invent its contents.

Do not assume or invent a product name, project idea, users, requirements or
technical choices. Do not implement product code or approve records on the
user's behalf.

## Setup steps

1. Read [aidflow.md](aidflow.md) and follow its Project entry point and
   referenced flows.
2. Create `.github/copilot-instructions.md` with the reference below, preserving
   any existing instructions.

   ```markdown
   # AIDFlow

   For development work, read and follow
   https://raw.githubusercontent.com/vanlangenlabs/aidflow/main/aidflow.md
   before acting or resuming. Resolve its Project and flow links relative to that URL and keep all sources
   on the same version. If inaccessible, report the limitation and request an
   accessible copy; do not guess.
   ```

3. Initialize the consuming project's `.aidflow/` workspace as directed by
   `aidflow.md`, preserving existing files.
4. Start the Concept Question interaction in a pull request comment titled
   "Questions for the project owner". Do not put the questions only in the pull
   request description. If you cannot post a comment, state that limitation in
   the pull request and stop.
   - If the project purpose is not already clear, first ask what the project
     should do or what problem it should solve.
   - Follow the Question protocol and the Concept phase example to identify other
     missing information. Ask only focused questions needed to fill
     `.aidflow/concept.md`.
5. Record the unanswered questions and next action as a pending interaction in
   `.aidflow/index.md`.
6. Explain the setup changes, checks performed and how to resume in the pull
   request.
7. Tell the user to include `@copilot` in every pull request comment whose answer
   or instruction should be processed. Several answers may be bundled in one
   comment. A plain reply may not start or resume a task. Repeat this reminder
   for follow-up questions.
8. End this task after asking. Do not continue until the user responds.

## After the user answers

Resume from `.aidflow/index.md`. Use the answers to draft `.aidflow/concept.md`
and present that exact version for review and explicit approval. Keep unresolved
questions visible. Do not begin feature intake or implementation until the
concept is approved.
