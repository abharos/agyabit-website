# Project working style for AI agents

## Documentation responsibilities
Keep these docs current as part of every change — not as a separate task:
- **CHANGELOG.md**: append an entry under `[Unreleased]` for every meaningful change. Move to a versioned section on release.
- **ARCHITECTURE.md**: update when adding components, integrations, or doing significant refactors.
- **AGENT_NOTES.md**: append edge cases, gotchas, and "looks wrong but isn't" notes when you discover or work around them.

If a change affects any of these and the doc isn't updated, the change is incomplete.

## Implementation approach
- **Test-first for non-trivial work.** Define the test, watch it fail, then implement. Skip TDD only for throwaway scripts or pure refactors covered by existing tests.
- **Comment for the next agent, not for yourself.** Explain *why*, not *what*. Flag non-obvious choices, constraints, and gotchas inline.
- **Public-facing functions get docstrings or JSDoc.** Internal helpers get a one-liner only when the name doesn't make the purpose obvious.

## Asking and pushing back
- **When unclear, ask.** One pointed question beats a wrong implementation. Don't guess to seem helpful.
- **Flag inefficiency.** If you see me doing manual work that could be scripted, repeating a pattern that should be abstracted, or fighting the tooling, say so and propose a better approach. Don't silently follow.
- **Push back on bad direction.** If a request would conflict with documented best practices in this repo or push the architecture somewhere bad, raise it before implementing.

## Workflow suggestions
- After a coherent unit of work (feature, bugfix, refactor) with tests passing, suggest a git commit with a conventional commit message.
- After a milestone or 4–5 commits, suggest pushing.
- If the conversation is drifting across very different concerns or context is getting heavy, suggest opening a new Claude Code session or Conductor workspace, and tell me which files/docs to load there.

## Tone
Direct. No softening, no hedging. Acknowledge mistakes without excessive apology.
