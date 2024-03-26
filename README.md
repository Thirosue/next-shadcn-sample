<div align="center"><strong>Next.js 14 Admin Dashboard Starter Template With Shadcn-ui</strong></div>
<div align="center">Built with the Next.js App Router and Server Actions</div>
<br />
<div align="center">
<a href="https://next-shadcn-dashboard-starter.vercel.app">View Demo</a>
<span>
</div>

## require

- node.js
- docker or vercel postgres

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 14](https://nextjs.org/)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- Auth - [Nextauth](https://next-auth.js.org)
- Tables - [Tanstack Tables](https://ui.shadcn.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- ORM - [drizzle](https://orm.drizzle.team/)
- Linting - [ESLint](https://eslint.org)
- Formatting - [Prettier](https://prettier.io)

## Pages

| Pages                                                                             | Specifications                                                                                        |
| :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [Signup](https://next-shadcn-dashboard-starter.vercel.app/)                       | Authentication with **NextAuth** supports Social logins and email logins(Enter dummy email for demo). |
| [Dashboard](https://next-shadcn-dashboard-starter.vercel.app/dashboard)           | Cards with recharts graphs for analytics.                                                             |
| [Users](https://next-shadcn-dashboard-starter.vercel.app/dashboard/user)          | Tanstack tables with user details client side searching, pagination etc                               |
| [Users/new](https://next-shadcn-dashboard-starter.vercel.app/dashboard/user/new)  | A User Form.                                                                                          |
| [Not Found](https://next-shadcn-dashboard-starter.vercel.app/dashboard/notfound)  | Not Found Page Added in the root level                                                                |
| -                                                                                 | -                                                                                                     |

## Getting Started

Follow these steps to clone the repository and start the development server:

### Clone

```
gh repo clone Thirosue/next-shadcn-sample
```

### dependencies installation

```
npm i
```

### Setting up with vercel postgres (If you use docker, skip)

#### Setting up the environment

- Pull your latest environment variables

```
vercel env pull .env.development.local
```

- Paste the contents of .env.development.local into .env

```
cp .env.development.local .env
```

- Add the following two lines from .env.example to the beginning of .env.development.local. 

```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

* logs

```
head -n 6 .env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# Created by Vercel CLI
NEXTAUTH_SECRET="••••••••••••••••••••••••••••••••••="
NX_DAEMON=""
```

### Setting up with docker-compose (If you use vercel postgres, skip)

#### Setting up the environment

- Create a `.env` file by copying the example environment file:

```
cp .env.example .env
```

##### Add the required environment variables to the `.env` file.

- Generate a secret for the next-auth

```
# generate a secret for the next-auth
openssl rand -base64 32
kk5DQe1JJKk6PIYoP06Ho4d0F9M6X0lcus7N5aYzG+Q= # Example secret
```

- Add the secret to the `.env` file

```
# paste the secret in the .env file
NEXTAUTH_SECRET={secret created above}
```

#### Running the database

- Running the postgres database using docker-compose

```
docker-compose up -d
```

### Running the migrations

```
npm run db:push
```

* logs

```
npm run db:push

> next-shadcn-sample@0.1.0 db:push
> dotenv drizzle-kit push:pg

drizzle-kit: v0.20.14
drizzle-orm: v0.30.4

No config path provided, using default path
Reading config file '/Users/hirosue/private/workspace/next-shadcn-sample/drizzle.config.ts'
[✓] Changes applied
```

- Running the seeders

```
npm run db:seed
```

* logs

```
npm run db:seed

> next-shadcn-sample@0.1.0 db:seed
> dotenv tsx src/db/seed.ts

⏳ Running seed...
📝 Inserting 30 users
📝 Inserting 4 categories
📝 Inserting 24 subcategories
📝 Inserting 100 products
✅ Seed completed in 149ms
```

### Running the development server

- `npm run dev`

You should now be able to access the application at http://localhost:3000.
