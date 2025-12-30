# Agent Instructions

## Project Overview

Turtle Tamagotchi - browser-based virtual pet game. Feed, play with, and care for a turtle to keep it alive.

## Tech Stack

- React 19 + TypeScript
- Vite (build/dev)
- Tailwind CSS v4 + shadcn/ui
- pnpm (package manager)

## Project Structure

```
src/
├── App.tsx              # Main app component
├── main.tsx             # Entry point
├── index.css            # Global styles + Tailwind
├── components/
│   ├── ui/              # shadcn/ui components (Button, Progress)
│   ├── turtle/          # Turtle component + CSS animations
│   ├── DeathScreen.tsx  # Game over overlay
│   ├── FeedEffect.tsx   # Food particle effects
│   └── StatBar.tsx      # Hunger/happiness bars
├── hooks/
│   ├── use-turtle-state.ts     # Game state (hunger, happiness, sleep, death)
│   └── use-turtle-movement.ts  # Turtle position/animation
└── lib/
    ├── constants.ts     # Game constants (MAX_STAT, decay rates)
    └── utils.ts         # Utility functions (cn)
```

## Code Conventions

### Filenames
- React components: **PascalCase** (`DeathScreen.tsx`, `Button.tsx`)
- Other TS files: **kebab-case** (`use-turtle-state.ts`, `constants.ts`)

### TypeScript
- No default exports, use named exports inline
- No `any` casts
- Avoid unnecessary abstractions

### React
- Compose small components, avoid large JSX blocks
- Avoid `useEffect` unless necessary
- Colocate related code

## Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Type-check + build
pnpm lint     # ESLint
pnpm format   # Prettier
```

## Issue Tracking

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Session Completion

**When ending a work session**, complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - `pnpm build`
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:

   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```

5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
