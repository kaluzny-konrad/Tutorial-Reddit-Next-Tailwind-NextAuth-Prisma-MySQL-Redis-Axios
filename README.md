# Tutorial-Breadit

From course: <https://www.youtube.com/watch?v=mSUKMfmLAt0>
repo with full course code.
original code: https://github.com/joschan21/breadit

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma + PlanetScale
- NextAuth + Google OAuth
- uploadthing.com
- upstash for redis

## Features
Infinite scrolling for dynamically loading posts
Authentication using NextAuth & Google
Custom feed for authenticated users
Advanced caching using Upstash Redis
Optimistic updates for a great user experience
Modern data fetching using React-Query
A beautiful and highly functional post editor
Image uploads & link previews
Full comment functionality with nested replies

## Instalation

1. npm install

Repo updated with:

- npm-check
- npm-check-updates
- npm outdated

## Process

1. npx shadcn-ui@latest init (+npx shadcn-ui@latest add toast)
1. Google Cloud Console secrets to .env:
   <https://console.cloud.google.com/>

- new project
- oauth client id:
  <https://console.cloud.google.com/apis/credentials/oauthclient>
- Web Application
- Javascript origin: <http://localhost:3000> (for local development)
- Redirect URI: <http://localhost:3000/api/auth/callback/google>
  6b. Copy secret to .env.local

1. Prepare prisma db:
   <https://app.planetscale.com/>
   effect: DATABASE_URL in .env

1. after prisma change lets push:
   npx prisma db push
   npx prisma generate

1. npx shadcn-ui@latest add dropdown-menu
   npx shadcn-ui@latest add avatar

1. Prisma add Posts (SHIFT+ALT+F for auto complete)

1. npx shadcn-ui@latest add input

1. <https://uploadthing.com/dashboard/lhjy0ned75>
   then .env

1. to look in data:
   (npx prisma studio)

1. init upstash and add to env

1. npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
