# Impeccable local workflow

[Impeccable](https://impeccable.style) provides design skills for coding agents and a deterministic detector for UI anti-patterns. ParkQuest uses it as a local, advisory design aid. It is not part of required CI.

## Requirements

Impeccable 3.2.0 requires Node.js 24 or newer. This is stricter than ParkQuest's current Node.js 20+ application requirement. Switch to Node 24+ before installing or running Impeccable; this does not change the application's production runtime.

For example, with `nvm`:

```bash
nvm install 24
nvm use 24
```

## Install the agent skills

Install Impeccable globally for the local Codex CLI and OpenCode harnesses so generated skill files do not dirty the ParkQuest worktree:

```bash
npx --yes impeccable@3.2.0 skills install -y --providers=codex,opencode --scope=global
```

Run the command again with a newer reviewed version when intentionally upgrading Impeccable. Do not commit files generated in home-directory agent configuration.

## First run

Start Codex CLI or OpenCode from the ParkQuest repository and run:

```text
/impeccable init
```

Use [`docs/prompts/impeccable-parkquest-foundation.md`](prompts/impeccable-parkquest-foundation.md) as the project brief. The first design-foundation pass should document the existing system; it should not redesign or refactor the application.

Run documentation-generating work on a dedicated branch. Review every generated file and diff before committing it. Do not assume generated `DESIGN.md` or UI rules are automatically correct.

## Recommended workflow

1. Pull `main` and create a focused branch for one design-system task.
2. Start the coding agent from the repository root.
3. Run `/impeccable init` if the repository does not have design context yet.
4. Give the agent the ParkQuest foundation prompt or a narrower task derived from it.
5. Review proposed changes against `src/components/ui/styles.ts` and the current product direction.
6. Keep application changes in separately scoped issues and PRs. Do not combine a broad design pass with setup or documentation work.
7. Run the normal ParkQuest validation commands before publishing code changes.

## Run the detector

Human-readable findings:

```bash
npm run design:detect
```

JSON output for local analysis or tooling:

```bash
npm run design:detect:json
```

The scripts use the reviewed Impeccable 3.2.0 CLI through `npx`; no package dependency is installed into ParkQuest. The detector exits with code `2` when it finds anti-patterns. That exit code means findings were reported, not that the application or test suite failed.

Detector results are advisory for now. Do not add these scripts to required GitHub Actions checks until the team has reviewed the baseline findings, agreed on suppressions, and decided which rules should block changes.
