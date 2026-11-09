# Contributing to AIDFlow

Thanks for your interest! AIDFlow is a set of Markdown instructions and Mermaid
flows that guide AI agents through a human-approved development process.
Improvements to the flows, the instructions and the documentation are welcome.

## Ways to contribute

- **Report a problem:** an agent skipped a step, misread a rule, or a flow has a
  dead end. Open an issue and describe what happened.
- **Suggest an idea:** a missing step, a clearer rule, a better approval gate.
- **Improve the docs:** README, viewer, examples.
- **Share your experience:** what worked or failed when you ran AIDFlow on a real task.

Please search existing issues first to avoid duplicates.

## Reporting an issue

Include, where possible:

- Which agent or tool you used (for example GitHub Copilot) and the AIDFlow
  version (commit or tag).
- The task you gave it and which flow or node it was in.
- What you expected and what actually happened.
- The relevant part of your `.aidflow/index.md`, if the run was resumed.

## Making a change

1. Fork the repository and create a branch.
2. Make one focused change per pull request.
3. Describe in the pull request **why** the change is needed and which flows or
   instructions it affects.
4. Update the README if the change affects how AIDFlow is used.

## Guidelines for flows and instructions

- **One source per rule.** State a rule in exactly one place. Link to it instead of
  repeating it in another flow or file.
- **Keep node IDs stable.** If an ID must change, document an old-to-new mapping
  in the workflow notes in `flows/project.mmd`.
- **Keep the setup copy list in sync.** `setup.md` lists every file copied into a
  consuming repository's `.aidflow/method/`. Update it when you add, rename or
  remove a flow or reference file.
- **Core vs reference.** Keep `aidflow.md` small and always-needed. Put detailed,
  situational rules in `reference/` and add its trigger to the table in `aidflow.md`.
- **Keep it readable for an AI.** Be explicit and unambiguous, and keep each step
  short. Never weaken an approval gate for convenience.
- **Check the transitions.** If you change a transition or an approval gate, walk
  through these maintenance checks, and update them if needed: new project; next
  release; nested resume; rejected Design; changed Definition; code/design defects;
  missing evidence or tracker conflict; workflow migration; verified feature repair;
  Design revision with reuse; removed, deferred and cancelled scope; index
  initialization without self-hashing; changed reference rules on resume; partial
  and sufficient answers in Definition and Design.
- **Test with a real run.** Try the change on a small task with an agent and note
  what you observed in the pull request.
- **Valid Mermaid.** Make sure changed `.mmd` files still render, for example in
  the [viewer](https://aidflow.vanlangen.org) or on GitHub.

## Commit messages

Use a short, imperative summary, for example `Clarify rework routing in Verification`.

## Code of conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are licensed under the
[LICENSE](LICENSE) of this repository.
