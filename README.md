# DrugDeck MVP

Stateless React + Tailwind MVP for Eleo Labs `/drugdeck`.

## What is included

- Mobile-friendly DrugDeck app
- Area > Class scope selection
- Select all / deselect all controls
- Flip cards with clean brand-focused back side
- `more` full drug profile panel
- Quiz mode using the same scope filters
- Extended Top 250 dataset with MOA, side effects, and interactions
- Extended quiz bank

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploy the `dist/` folder to `/drugdeck` on your host.

## Data notes

Drug names are stored in Pascal Case. Brand `®` is rendered in the UI only.

MOA, side effects, and interactions are high-yield MVP study aids and should be clinically reviewed before public launch.
