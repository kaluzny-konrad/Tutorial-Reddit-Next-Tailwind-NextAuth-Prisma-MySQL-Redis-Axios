# Tutorial-Breadit

From course: <https://www.youtube.com/watch?v=mSUKMfmLAt0>

- 29.06: 21:51
- 30.06: 59:17, 1:04:11, 1:40:24, 1:54:17
- 01.07: 2:19:39, 2:37:24, 2:50:25, 3:15:35, 3:34:00
- 02.07: 4:21:47, 5:02:18, 5:32:08
- 03.07: 5:50:58, 6:31:36
- 04.07: 6:57:01, 7:13:41
- 05.07: 7:32:00, 7:38:49, 8:05:27
- 06.07: 8:20:36
- 07.07: 8:30:22

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma + PlanetScale
- NextAuth + Google OAuth
- uploadthing.com
- upstash for redis

Repo updated with:

- npm-check
- npm-check-updates
- npm outdated

## Instalation

1. npm install

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