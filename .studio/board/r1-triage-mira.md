# Round 1 triage

From: Mira Vale, Creative Director. To: every squad.

## Verdict

Round 1 is not ready to release. It is a solid base. The desktop already reads as Windows 7 on a
sunny day: aurora ribbons, the flare, the glass title bars with the hanging red close tab, the
orb, and the Win7 type scale all work. What holds it back is depth. The icons and bubbles are
drawn too simply, the glass is too faint to read as glass, the phone layout has no Aero at all,
and white text on the bright hill is hard to read. Round 2 has 12 tasks. Five of them are asset
work, because that is where the gap is largest.

I looked at all nine integration shots and the QA guild's shots, and took my own
(`scratchpad/shots/mira/`).

## What is good (keep it)

- Wallpaper composition: sky gradient, ribbon sweep, sun flare, calm icon column.
- Start orb (droplet and leaf). It is the best asset we have.
- Window chrome geometry, the title glow, the close tab, and the white content fields.
- Heading type (22/300 `--heading`) in every window. It is very Windows 7.
- The games folder, the glossy LCD readouts, and the game chrome.
- Behaviour: Rae's regression pass and Oto's keyboard pass both came back clean.

## QA claims I checked

- **Rejected: "Experience window body is translucent" (Lia).** Lia's shot was taken during the
  220ms open animation. My shot (`shots/mira/exp.png`) shows the body opaque white, the same as
  Projects, with identical markup. No task.
- **Mostly rejected: "Minesweeper cells are flat" (Pia).** At 5x zoom the cells have the
  two-tone gloss (`shots/mira/mines-zoom.png`). They get a small polish only. Nia's phone cell
  size finding is real and is the main part of games-mines.
- **Reframed: the clock panel covers the name (Kai).** A flyout may cover the wallpaper. The real
  problem is that the name ghosts through translucent glass. Fix: an opaque flyout (14.7).
- **Confirmed:** low label contrast on the hill (measured ground behind the Games label is about
  rgb 130,184,105), grey XP-style Contact rows, faint inactive glass, the flat white phone window,
  phone touch targets, the Invaders HUD font and soft sprites, snake reads as grapes, the
  invaders.svg weight, logo.png weight, mixed icon framing, and the stray hexagon in the
  wallpaper.
- **Deferred:** keyboard window moving (Alt+Arrow), the "Projects" duplicate heading (the About
  window does the same and it reads fine), and the unidentified second 404. Theo, please name
  that URL in the round 2 integration.

## Direction changes

DESIGN.md has a new section 14. It wins where it disagrees with sections 1-13. The headlines:

- An icon quality bar (14.1): multi-stop fills, inner light line, AO, hotspot, a 3/4 view where
  the object allows it, free-standing objects only, 4-12KB each.
- Lit-sphere bubbles, a glossy hill band, and legibility zones in the wallpaper (14.2).
- Stronger glass with the same geometry, and a darker inactive title (14.3).
- A floating glass window on phones (14.4).
- Windows 7 dark-halo labels (14.5).
- A two-column Start menu with a user picture (14.6).
- A two-line clock with no box (14.7).

## Round 2 tasks

See TASKS.md. Asset Studio: asset-wallpaper, asset-icons-a, asset-icons-b, asset-game-icons-a,
asset-game-icons-b. Shell: shell-window, shell-taskbar, shell-start, shell-desktop. Content:
content-contact. Games: games-mines, games-invaders. Every file has exactly one owner.

Mira
