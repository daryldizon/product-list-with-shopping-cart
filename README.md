# Product List with Shopping Cart

A React app that lists products from `public/assets/Products.csv` with filtering by category and brand, search, pagination and a shopping cart persisted in `localStorage`.

Built with React 19, Vite, Tailwind CSS 4, react-modal and SweetAlert2.

## Requirements

- Node.js 24.x (`^24.15.0`, see `.nvmrc`)
- pnpm 10 (`corepack enable` picks up the version pinned in `package.json`)

## Scripts

| Command        | Description                                     |
| -------------- | ----------------------------------------------- |
| `pnpm install` | Install dependencies                            |
| `pnpm dev`     | Start the dev server at http://localhost:3000   |
| `pnpm build`   | Build for production into `build/`              |
| `pnpm preview` | Serve the production build locally              |
| `pnpm test`    | Run the tests with Vitest                       |
| `pnpm lint`    | Lint with ESLint                                |
