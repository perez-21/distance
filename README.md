# Distance

A small Next.js project that stores user locations and returns the nearest users to a given location.

## What this project does

- Accepts new users (with optional name and coordinates).
- Stores users in a MySQL database via Prisma.
- Given a user id and current coordinates, updates that user's location and returns the 10 nearest other users (distance in kilometers).

## Tech stack

- Next.js 15 (App Router)
- React 19
- Prisma (MySQL)
- geolib (for distance calculation)
- Tailwind CSS (dev dependency)

## Repo layout (high level)

- `app/` — Next.js app, API routes and pages
- `app/api/users/route.ts` — POST endpoint to create a user
- `app/api/users/[id]/close/route.ts` — GET endpoint to update a user's coords and return nearest users
- `prisma/schema.prisma` — Prisma schema (MySQL datasource)
- `app/generated/prisma` — Prisma client generator output

## Requirements

- Node.js (recommend v18+)
- pnpm (repository contains a `pnpm-lock.yaml`) or npm/yarn
- A MySQL database and a `DATABASE_URL` environment variable

## Environment

Create a `.env` file in the project root with at least:

```
DATABASE_URL=mysql://user:password@host:3306/database
```

## Install

Using pnpm (preferred for this repo):

```bash
pnpm install
```

Or npm:

```bash
npm install
```

## Prisma setup

After installing dependencies, generate the Prisma client and run migrations (if you want to run locally):

```bash
# generate client
pnpm prisma generate

# run migrations (creates schema if migrations exist)
pnpm prisma migrate dev
```

Note: the Prisma client is configured to output to `app/generated/prisma`.

## Scripts

Key scripts from `package.json`:

```
pnpm dev    # next dev --turbopack
pnpm build  # next build --turbopack
pnpm start  # next start
pnpm lint   # eslint
```

When running locally the dev server defaults to http://localhost:3000.

## API

Base path: `/api/users`

1) Create user — POST `/api/users`

Request body (JSON):

```json
{
  "name": "optional name",
  "longitude": -122.4194,
  "latitude": 37.7749
}
```

Response (success):

```json
{
  "message": "User added",
  "user": { "id": "<nanoid>", "name": "...", "lng": -122.4194, "lat": 37.7749 }
}
```

2) Nearest users — GET `/api/users/{id}/close?lat=<lat>&lng=<lng>`

- This endpoint updates the user record identified by `{id}` with the provided `lat` and `lng`.
- Then it computes distances (using `geolib`) from the provided point to all other users, returns up to 10 nearest users sorted by distance (in kilometers).
- Defaults: if query params are missing the code uses `lat=10.000` and `lng=1.000`.

Response (example):

```json
[
  { "id": "...", "name": "Alice", "distance": 0.42 },
  { "id": "...", "name": "Bob", "distance": 2.13 }
]
```

## Example curl requests

Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Eve","longitude":-122.42,"latitude":37.77}'
```

Get nearest users (replace `<id>` with the created id):

```bash
curl "http://localhost:3000/api/users/<id>/close?lat=37.77&lng=-122.42"
```

## Notes & troubleshooting

- Ensure `prisma generate` is run before starting the app so the client is available in `app/generated/prisma`.
- The project expects a MySQL database. If you use a different provider, update `prisma/schema.prisma`.
- The code uses `nanoid` to create user ids.
- If you see runtime errors about missing types or the generated client, re-run `pnpm prisma generate` and restart the dev server.

## Development tips

- The `GET /.../close` route uses `geolib.getDistance` and divides by 1000 to return kilometers.
- The route updates the requesting user's coordinates before computing distances so the returned nearest users are relative to the newest position.

## License

This repository does not include a license file. Add one if you plan to publish.

---

If you'd like, I can also:

- Add a basic `README` badge for build/dev commands.
- Add a short `CONTRIBUTING.md` with dev workflow and pull request guidelines.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
