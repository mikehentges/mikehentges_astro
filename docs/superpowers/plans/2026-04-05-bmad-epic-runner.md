# bmad-epic-runner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a global Claude Code orchestrator skill that runs the full BMAD pipeline for an entire epic — plan, implement all stories, integrate and report.

**Architecture:** Two-file skill (`SKILL.md` + `workflow.md`) installed at `~/.claude/skills/bmad-epic-runner/`. The workflow is a three-phase state machine that delegates to existing BMAD skills (`bmad-init`, `bmad-create-story`, `bmad-dev-story`, `bmad-code-review`) and manages branch lifecycle, failure recovery, and progress reporting.

**Tech Stack:** Claude Code skill system (Markdown with XML workflow directives), git CLI, BMAD skill ecosystem

---

### Task 1: Create SKILL.md

**Files:**
- Create: `~/.claude/skills/bmad-epic-runner/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p ~/.claude/skills/bmad-epic-runner
```

- [ ] **Step 2: Write SKILL.md**

Create `~/.claude/skills/bmad-epic-runner/SKILL.md` with the following exact content:

```markdown
---
name: bmad-epic-runner
description: 'Run the full BMAD pipeline for an entire epic autonomously. Use when the user says "run epic pipeline", "run epic [epic-id]", "implement epic [epic-id]", or "run the next epic"'
argument-hint: '[epic-id] (optional — auto-discovers next backlog epic if omitted)'
---

Follow the instructions in ./workflow.md.
```

- [ ] **Step 3: Verify the file exists and has correct frontmatter**

```bash
cat ~/.claude/skills/bmad-epic-runner/SKILL.md
```

Expected: The file displays with `name: bmad-epic-runner` in the YAML frontmatter and a pointer to `./workflow.md`.

---

### Task 2: Write workflow.md — Header, Config, and Prerequisites

**Files:**
- Create: `~/.claude/skills/bmad-epic-runner/workflow.md`

- [ ] **Step 1: Write the workflow header, role definition, and initialization section**

Create `~/.claude/skills/bmad-epic-runner/workflow.md` with the following content. This is the first portion of the file — subsequent tasks will append to it.

```markdown
# Epic Runner Workflow

**Goal:** Run the full BMAD pipeline for an entire epic — plan review, story implementation, integration, and reporting.

**Your Role:** Orchestrator managing the full epic lifecycle.
- Communicate all responses in {communication_language} tailored to {user_skill_level}
- Generate all documents in {document_output_language}
- Execute ALL phases in exact order; do NOT skip phases
- Do NOT stop for "session boundaries" or "milestones" — continue until the epic is complete or a HALT condition triggers
- Delegate implementation work to existing BMAD skills; do not re-implement their logic
- NEVER push to remote, create PRs, or perform destructive git operations — provide instructions for the user instead

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `user_skill_level`
- `planning_artifacts`, `implementation_artifacts`
- `output_folder`

### Paths

- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `epics_file` = `{planning_artifacts}/epics.md`
- `architecture_file` = `{planning_artifacts}/architecture.md`
- `prd_file` = `{planning_artifacts}/prd.md`
- `ux_file` = `{planning_artifacts}/ux-design-specification.md`
- `deferred_work` = `{implementation_artifacts}/deferred-work.md`

### Prerequisites Check

<check if="config.yaml does not exist">
  <halt>BMAD is not configured for this project. Run `bmad-init` first.</halt>
</check>

<check if="sprint_status does not exist">
  <halt>No sprint-status.yaml found. Run `bmad-sprint-planning` first to generate it from your epics.</halt>
</check>

<check if="epics_file does not exist">
  <halt>No epics.md found at {planning_artifacts}/epics.md. Run `bmad-create-epics-and-stories` first.</halt>
</check>
```

- [ ] **Step 2: Verify the file was created correctly**

```bash
head -50 ~/.claude/skills/bmad-epic-runner/workflow.md
```

Expected: Shows the header through the prerequisites check section.

---

### Task 3: Write workflow.md — Phase 1 (Plan & Review)

**Files:**
- Modify: `~/.claude/skills/bmad-epic-runner/workflow.md` (append)

- [ ] **Step 1: Append the Phase 1 section to workflow.md**

Append the following content to the end of `~/.claude/skills/bmad-epic-runner/workflow.md`:

```markdown

---

## PHASE 1 — PLAN & REVIEW

<workflow>
  <critical>Complete all Phase 1 steps before presenting the plan to the user</critical>
  <critical>Do NOT begin Phase 2 without explicit user approval</critical>

  <step n="1.1" goal="Resolve target epic">
    <check if="user provided an epic identifier as argument">
      <action>Use the provided epic identifier (e.g., `epic-3`)</action>
      <goto anchor="load_epic" />
    </check>
    <action>Read sprint_status file</action>
    <action>Find the first epic with status `backlog`</action>
    <check if="no backlog epics found">
      <halt>All epics are complete or in-progress. No backlog epics to run.</halt>
    </check>
    <action>Set target_epic to the discovered epic key</action>
  </step>

  <step n="1.2" goal="Load epic context" anchor="load_epic">
    <action>Read the target epic section from epics_file — extract epic description and all story entries</action>
    <action>Read sprint_status — get current status of every story in this epic</action>
    <action>Build ordered story list from sprint_status (top-to-bottom = dependency order)</action>
    <action>For each story, check if a spec file exists in {implementation_artifacts}/ — flag as "spec exists" or "needs creation"</action>
    <check if="epic status is `in-progress` (resuming a previous run)">
      <action>Identify stories already marked `done` — these will be skipped</action>
      <action>Set resume_mode = true</action>
    </check>
  </step>

  <step n="1.3" goal="Review planning documentation">
    <action>Read architecture_file (if exists) — note key decisions relevant to this epic</action>
    <action>Read prd_file (if exists) — note requirements relevant to this epic</action>
    <action>Read ux_file (if exists) — note UX patterns relevant to this epic</action>
    <action>Read deferred_work (if exists) — note any deferred items relevant to this epic</action>
  </step>

  <step n="1.4" goal="Create or checkout feature branch">
    <action>Derive branch name: `feature/{epic-key}-{epic-title-slug}` (e.g., `feature/epic-3-blog-content-system`)</action>
    <check if="branch already exists (git branch --list 'feature/{epic-key}-*')">
      <action>Check out the existing branch: `git checkout {branch_name}`</action>
    </check>
    <check if="branch does not exist">
      <action>Create and check out: `git checkout -b {branch_name}`</action>
    </check>
  </step>

  <step n="1.5" goal="Present plan and wait for approval">
    <action>Display to the user:
      - **Epic:** name and description
      - **Branch:** branch name (created or checked out)
      - **Mode:** fresh run or resuming (if resume_mode, show which stories are already done)
      - **Stories to implement** (in order):
        - Story key, title, status
        - Whether spec exists or needs creation
        - Stories that will be skipped (already done)
      - **Relevant context:** key architectural decisions, UX patterns, deferred items
      - **Risks or concerns** identified during doc review
    </action>
    <halt reason="approval">Waiting for your approval to proceed to Phase 2 (implementation). Reply to continue.</halt>
  </step>
</workflow>
```

- [ ] **Step 2: Verify Phase 1 was appended correctly**

```bash
grep -c "PHASE 1" ~/.claude/skills/bmad-epic-runner/workflow.md
```

Expected: `1`

---

### Task 4: Write workflow.md — Phase 2 (Implement Stories)

**Files:**
- Modify: `~/.claude/skills/bmad-epic-runner/workflow.md` (append)

- [ ] **Step 1: Append the Phase 2 section to workflow.md**

Append the following content to the end of `~/.claude/skills/bmad-epic-runner/workflow.md`:

```markdown

---

## PHASE 2 — IMPLEMENT STORIES

<workflow>
  <critical>Process stories in dependency order (top-to-bottom from sprint_status)</critical>
  <critical>Skip stories already marked `done` in sprint_status</critical>
  <critical>After 3 failed attempts on any story, HALT for user guidance</critical>
  <critical>Display progress scoreboard after each story completes or is skipped</critical>

  <state>
    stories_completed = []
    stories_skipped = []
    stories_remaining = [all non-done stories from Phase 1 plan]
    current_attempt = 0
    max_attempts = 3
  </state>

  <step n="2.1" goal="Process next story" anchor="next_story">
    <check if="stories_remaining is empty">
      <goto anchor="phase_3" />
    </check>
    <action>Set current_story = first item from stories_remaining</action>
    <action>Set current_attempt = 0</action>
    <goto anchor="story_spec" />
  </step>

  <step n="2.2" goal="Ensure story spec exists" anchor="story_spec">
    <check if="spec file exists for current_story in {implementation_artifacts}/">
      <action>Story spec already exists — skip creation</action>
      <goto anchor="implement_story" />
    </check>
    <action>Invoke skill: `bmad-create-story` with the current story identifier</action>
    <action>Verify the story spec file was created in {implementation_artifacts}/</action>
    <check if="story spec was not created">
      <halt>Failed to create story spec for {current_story}. Check bmad-create-story output.</halt>
    </check>
  </step>

  <step n="2.3" goal="Implement the story" anchor="implement_story">
    <action>Invoke skill: `bmad-dev-story` with the story spec file path</action>
    <action>bmad-dev-story will handle: red-green-refactor, build verification, sprint-status updates, commits</action>
    <goto anchor="review_story" />
  </step>

  <step n="2.4" goal="Code review" anchor="review_story">
    <action>Invoke skill: `bmad-code-review` on changes for the current story</action>
    <check if="code review found issues requiring fixes">
      <action>Apply the fixes identified by code review</action>
      <goto anchor="verify_build" />
    </check>
    <check if="code review passed clean">
      <goto anchor="story_done" />
    </check>
  </step>

  <step n="2.5" goal="Verify build after review fixes" anchor="verify_build">
    <action>Run the project build command (determine from package.json scripts, Makefile, or equivalent)</action>
    <check if="build passes">
      <action>Commit review fixes to the epic branch</action>
      <goto anchor="story_done" />
    </check>
    <check if="build fails">
      <action>Increment current_attempt</action>
      <goto anchor="handle_failure" />
    </check>
  </step>

  <step n="2.6" goal="Handle build/test failure" anchor="handle_failure">
    <check if="current_attempt >= max_attempts">
      <action>Display failure details:
        - Story: {current_story}
        - Attempt: {current_attempt} of {max_attempts}
        - Error output from the build/test failure
        - What was tried in each attempt
      </action>
      <halt reason="failure">Story {current_story} failed after {max_attempts} attempts. Options:
        - **"continue"** — skip this story, flag for manual review, proceed to next
        - **"retry"** — try this story again (resets attempt counter)
        - **"skip"** — mark as skipped and move on
        - Or provide specific corrective guidance and say **"fix and continue"**
      </halt>
      <check if="user says continue or skip">
        <action>Add current_story to stories_skipped with failure reason</action>
        <action>Remove current_story from stories_remaining</action>
        <goto anchor="show_progress" />
      </check>
      <check if="user says retry">
        <action>Set current_attempt = 0</action>
        <goto anchor="implement_story" />
      </check>
      <check if="user provides corrective guidance">
        <action>Apply the user's guidance</action>
        <action>Set current_attempt = 0</action>
        <goto anchor="verify_build" />
      </check>
    </check>
    <check if="current_attempt < max_attempts">
      <action>Read the error output carefully</action>
      <action>Diagnose the root cause</action>
      <action>Apply a targeted fix</action>
      <goto anchor="verify_build" />
    </check>
  </step>

  <step n="2.7" goal="Mark story complete" anchor="story_done">
    <action>Ensure all changes for current_story are committed to the epic branch</action>
    <action>Add current_story to stories_completed</action>
    <action>Remove current_story from stories_remaining</action>
    <goto anchor="show_progress" />
  </step>

  <step n="2.8" goal="Display progress" anchor="show_progress">
    <action>Display scoreboard:
      ```
      === Epic Progress ===
      Completed: {stories_completed count} — {list of completed story keys}
      Remaining: {stories_remaining count} — {list of remaining story keys}
      Skipped:   {stories_skipped count} — {list with failure reasons}
      ```
    </action>
    <goto anchor="next_story" />
  </step>
</workflow>
```

- [ ] **Step 2: Verify Phase 2 was appended correctly**

```bash
grep -c "PHASE 2" ~/.claude/skills/bmad-epic-runner/workflow.md
```

Expected: `1`

---

### Task 5: Write workflow.md — Phase 3 (Integrate & Report)

**Files:**
- Modify: `~/.claude/skills/bmad-epic-runner/workflow.md` (append)

- [ ] **Step 1: Append the Phase 3 section to workflow.md**

Append the following content to the end of `~/.claude/skills/bmad-epic-runner/workflow.md`:

```markdown

---

## PHASE 3 — INTEGRATE & REPORT

<workflow anchor="phase_3">
  <critical>Run final build verification before generating the report</critical>
  <critical>Do NOT push to remote or create PRs — provide instructions only</critical>

  <step n="3.1" goal="Final build verification">
    <action>Run the project build command on the epic branch</action>
    <action>Record build result (pass/fail) and any warnings</action>
    <check if="build fails">
      <action>Attempt to fix build issues (up to 3 attempts)</action>
      <check if="still failing after 3 attempts">
        <halt>Final build is failing. Please review the errors and fix manually before generating the report.</halt>
      </check>
    </check>
  </step>

  <step n="3.2" goal="Update sprint status">
    <check if="all stories completed (stories_skipped is empty)">
      <action>Update epic status to `done` in sprint_status</action>
    </check>
    <check if="some stories were skipped">
      <action>Leave epic status as `in-progress` in sprint_status</action>
    </check>
    <action>Commit sprint-status.yaml update to the epic branch</action>
  </step>

  <step n="3.3" goal="Generate completion report">
    <action>Determine epic number from the epic key (e.g., `epic-3` → `3`)</action>
    <action>Create file: `{implementation_artifacts}/epic-{N}-completion-report.md`</action>
    <action>Write the report with this structure:

    ```markdown
    # Epic {N} Completion Report — {Epic Title}

    **Branch:** {branch_name}
    **Date:** {current_date}
    **Status:** {Complete | Partial (N stories skipped)}

    ## Stories Completed

    | Story | Title | Summary |
    |-------|-------|---------|
    | {key} | {title} | {brief description of what was implemented} |

    ## Stories Skipped

    | Story | Title | Failure Reason | Attempts |
    |-------|-------|----------------|----------|
    | {key} | {title} | {why it failed} | {N} |

    _(Empty if all stories completed)_

    ## Build Result

    **Status:** {PASS/FAIL}
    **Warnings:** {any warnings, or "None"}

    ## Deferred Items

    {Items logged to deferred-work.md during this epic, or "None"}

    ## Next Steps

    To push this branch and create a PR:

    ```bash
    git push -u origin {branch_name}
    gh pr create --title "feat: {epic title}" --body "Epic {N} implementation — see epic-{N}-completion-report.md for details"
    ```
    ```
    </action>
    <action>Commit the completion report to the epic branch</action>
  </step>

  <step n="3.4" goal="Present results to user">
    <action>Display the full completion report</action>
    <action>If all stories completed: "Epic {N} is complete! Review the report and push when ready."</action>
    <action>If stories were skipped: "Epic {N} is partially complete. {N} stories need manual attention. Review the report for details."</action>
  </step>
</workflow>
```

- [ ] **Step 2: Verify the complete workflow file**

```bash
wc -l ~/.claude/skills/bmad-epic-runner/workflow.md
```

Expected: Approximately 220-240 lines total.

- [ ] **Step 3: Verify all three phases are present**

```bash
grep "^## PHASE" ~/.claude/skills/bmad-epic-runner/workflow.md
```

Expected:
```
## PHASE 1 — PLAN & REVIEW
## PHASE 2 — IMPLEMENT STORIES
## PHASE 3 — INTEGRATE & REPORT
```

---

### Task 6: End-to-End Verification

**Files:**
- Read: `~/.claude/skills/bmad-epic-runner/SKILL.md`
- Read: `~/.claude/skills/bmad-epic-runner/workflow.md`

- [ ] **Step 1: Verify SKILL.md is valid**

```bash
cat ~/.claude/skills/bmad-epic-runner/SKILL.md
```

Expected: Valid YAML frontmatter with `name: bmad-epic-runner`, description, argument-hint, and pointer to `./workflow.md`.

- [ ] **Step 2: Read the full workflow.md and verify structure**

Read the complete `~/.claude/skills/bmad-epic-runner/workflow.md` file and verify:
- INITIALIZATION section with config loading and prerequisites
- PHASE 1 with steps 1.1–1.5, ending with a HALT for user approval
- PHASE 2 with steps 2.1–2.8, state tracking, failure handling with 3-attempt limit and HALT
- PHASE 3 with steps 3.1–3.4, report generation, no auto-push
- All `<goto>` anchors have matching `anchor=` attributes
- No placeholder text (TBD, TODO, etc.)

- [ ] **Step 3: Verify the skill appears in Claude Code's skill list**

Start a new Claude Code session or check that the skill is discoverable. The skill should appear when searching for "epic" or "bmad-epic-runner" in the skill list.

- [ ] **Step 4: Done**

The skill files are in place at `~/.claude/skills/bmad-epic-runner/`. No git commit needed — global skills live outside any project repo.
