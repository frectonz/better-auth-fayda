# better-auth-fayda

Your `.env` file should look like this.

```
DATABASE_URL=file:local.db
BETTER_AUTH_URL=http://localhost:3000
CLIENT_ID=
PRIVATE_KEY=
```

Install packages

```bash
pnpm install
```

Setup Database

```bash
pnpm db:push
```

Run Dev Server

```bash
pnpm dev --port 3000
```
