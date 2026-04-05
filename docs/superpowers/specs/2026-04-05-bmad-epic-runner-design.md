# bmad-epic-runner — Design Spec

**Date:** 2026-04-05
**Type:** Global Claude Code skill (orchestrator)
**Location:** `~/.claude/skills/bmad-epic-runner/`

## Overview

An orchestrator skill that runs the full BMAD pipeline for an entire epic autonomously. It chains existing BMAD skills (`bmad-init`, `bmad-create-story`, `bmad-dev-story`, `bmad-code-review`) in sequence, managing branch lifecycle, failure recovery, and progress reporting.

The skill is project-agnostic — it works with any project that has BMAD configured (`_bmad/bmm/config.yaml` and `sprint-status.yaml`).

## Activation

**Triggers:**
- "run epic pipeline"
- "run epic [epic-id]"
- "implement epic [epic-id]"
- "run the next epic"

**Argument:** Optional epic identifier (e.g., `epic-3`). If omitted, auto-discovers the first `backlog` epic from `sprint-status.yaml`.

**Prerequisites:** `_bmad/bmm/config.yaml` and `sprint-status.yaml` must exist. Halts with guidance if not.

## Skill Structure

```
~/.claude/skills/bmad-epic-runner/
  SKILL.md       # Metadata, description, activation context
  workflow.md    # Full execution logic (3 phases)
```

## Phase 1 — Plan & Review

**Goal:** Review context, prepare branch, get user approval.

1. Invoke `bmad-init` to load project config and resolve paths.
2. Resolve target epic:
   - If argument provided: use that epic identifier.
   - If no argument: find the first epic with `backlog` status in `sprint-status.yaml`.
   - If no backlog epics exist: display "All epics are complete or in-progress" and exit.
3. Review existing documentation:
   - `epics.md` — target epic section and its stories
   - `architecture.md`
   - `prd.md`
   - `ux-design-specification.md`
   - `sprint-status.yaml` — current state of all stories
   - `deferred-work.md` — anything relevant to this epic
4. Identify story execution order — list all stories for the epic top-to-bottom from `sprint-status.yaml`. Flag which have existing spec files vs. which need creation.
5. Branch management:
   - If an epic feature branch already exists (`feature/{epic-key}-{slug}`): check it out.
   - Otherwise: create `feature/{epic-key}-{slug}` from the current branch.
6. Present plan summary:
   - Epic name and description
   - Stories in order (pre-existing specs vs. to-be-created)
   - Branch name
   - Risks or concerns from doc review
7. **PAUSE — wait for user approval.**

### Resumability

If the epic is already `in-progress` (previous session interrupted):
- Detect and check out the existing feature branch.
- Read `sprint-status.yaml` to find which stories are `done`.
- Skip completed stories; resume from the first non-done story.
- Announce what's being resumed and where.

## Phase 2 — Implement Stories

**Goal:** Create specs, implement, review, and commit each story sequentially.

**For each story in dependency order:**

1. **Check story spec** — if the story file doesn't exist in `implementation-artifacts/`, invoke `bmad-create-story`. If it exists, skip to step 2.
2. **Implement** — invoke `bmad-dev-story`. This handles the red-green-refactor cycle, build verification, and sprint-status updates.
3. **Code review** — invoke `bmad-code-review` on the story's changes.
4. **Apply fixes** — if the code review surfaces issues, apply them.
5. **Verify** — run the project's build command to confirm the build passes after review fixes. (Determined from `package.json` scripts, `Makefile`, or equivalent — not hardcoded.)
6. **Commit** — ensure all work for this story is committed to the epic branch. (`bmad-dev-story` handles most commits; the orchestrator catches anything uncommitted.)
7. **Log result** — track story as `completed` or `failed` with details.

### Failure Handling

- If build/tests fail after implementation, retry up to **3 attempts** (re-read errors, adjust code, rebuild).
- After 3 failed attempts: **HALT execution.**
  - Display: what failed, which attempt, what was tried.
  - Wait for user guidance.
  - User can respond with:
    - **"continue"** — skip this story, flag for manual review, proceed to next.
    - **"retry"** — try the failed story again.
    - **"skip"** — mark as skipped and move on.
    - Or provide specific corrective guidance.

### Progress Tracking

After each story completes (or is skipped), display a running scoreboard:
- Stories completed
- Stories remaining
- Stories skipped (with reasons)

## Phase 3 — Integrate & Report

**Goal:** Verify the full build, generate a completion report.

1. **Final build verification** — run the project's build command on the epic branch.
2. **Generate completion report** — create `_bmad-output/implementation-artifacts/epic-{N}-completion-report.md`:
   - **Epic summary** — name, branch, date
   - **Stories completed** — list with brief description
   - **Stories skipped** — list with failure reason and attempts
   - **Build result** — pass/fail with warnings
   - **Deferred items** — anything logged to `deferred-work.md` during implementation
   - **PR instructions** — git commands to push branch and create PR against main
3. **Update sprint-status.yaml**:
   - Mark epic as `done` if all stories completed.
   - Leave as `in-progress` if any stories were skipped.
4. **Display report** to user with next steps.

**Note:** Per project conventions, the skill does NOT automatically push, create PRs, or perform destructive git operations. It provides instructions for the user.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Orchestrator over existing skills | Leverages maintained BMAD skills; changes to underlying skills automatically benefit the runner |
| Branch strategy | One branch per epic | Simple, clean history; aligns with existing `bmad-dev-story` commit behavior |
| Story spec creation | Skip if exists | Lets users pre-customize specs while remaining fully autonomous by default |
| Failure model | Halt after 3 attempts | Balances autonomy with safety; user can intervene, then continue/retry/skip |
| Epic discovery | Auto-discover with optional override | Flexible; supports both "run the next thing" and "run this specific epic" |
| Location | Global skill (`~/.claude/skills/`) | Available to any BMAD-configured project |
| Git operations | Read-only except branch creation and commits | Respects project CLAUDE.md constraints; no pushes or PRs |

## Dependencies

- **Required skills:** `bmad-init`, `bmad-create-story`, `bmad-dev-story`, `bmad-code-review`
- **Required files:** `_bmad/bmm/config.yaml`, `sprint-status.yaml`, `epics.md`
- **Optional files:** `architecture.md`, `prd.md`, `ux-design-specification.md`, `deferred-work.md`
