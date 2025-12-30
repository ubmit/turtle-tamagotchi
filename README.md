# Turtle Tamagotchi

A pixel art virtual pet game inspired by the classic Tamagotchi.

## Features

- **Feed** - Right-click anywhere to feed your turtle
- **Play** - Click the turtle to increase happiness
- **Sleep** - Toggle sleep mode to pause stat decay
- **Persistence** - Stats saved to localStorage, including offline decay

## Mechanics

| Stat | Decay | Recovery |
|------|-------|----------|
| Hunger | -1 every 10s | +5 per feed |
| Happiness | -1 every 10s | +10 per play |

Stats turn red and pulse when below 25. Turtle dies if either stat hits 0.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui

## Development

```bash
pnpm install
pnpm dev
```

## License

MIT
