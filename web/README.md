# Restaurant Discovery (Frontend)

Next.js frontend for browsing restaurants and filtering by category.

## Requirements

- Node.js 18+ (Node.js 20 recommended)
- npm 9+

## First-Time Setup

This frontend calls a local proxy API on `http://localhost:4000`, so run both services.

### 1) Install dependencies

From the project root:

```bash
cd web
npm install
cd ../proxy
npm install
```

### 2) Configure environment (optional)

The frontend currently defaults to `http://localhost:4000`, so this step is optional but recommended:

```bash
cd web
cp .env.local.example .env.local
```

`web/.env.local.example`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 3) Start the proxy API

In one terminal:

```bash
cd proxy
npm run dev
```

You should see `Proxy listening on http://localhost:4000`.

### 4) Start the frontend

In a second terminal:

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Commands

```bash
npm run build
npm run start
```

## Troubleshooting

- If the page shows API errors, confirm the proxy is running on port `4000`.
- If port `4000` is in use, stop the conflicting process or run the proxy with a different port:

```bash
cd proxy
PORT=4001 npm run dev
```

Then point the frontend to that port in `web/.env.local`.
