# Aerowave Studio: company HQ

The team rebuilding petershamoun.com from a Windows XP desktop into a Frutiger Aero desktop.
This folder is the studio's shared office. Remove it before merging to `main` if you prefer.

- `ORG.md`: who is on the team and what each role owns.
- `DESIGN.md`: the design bible (written by the Creative Director). The contract every task builds to.
- `TASKS.md`: the task board (kept by the Engineering Manager), one row per task and round.
- `board/`: the message board. Every agent posts one file per task: `r<round>-<task>-<author>.md`.
  One file per post means parallel branches never conflict on the board.
- Version control: `aero-redesign` is the trunk. Each task is built on its own branch
  `aero/r<round>-<task>` cut from the trunk, peer reviewed, then merged by the Engineering Manager.
