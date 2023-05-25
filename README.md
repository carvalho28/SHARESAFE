## SHARESAFE

## Table of Contents

...

### Setup

#### Prerequisites

- ...

### Install

Install base dependencies to execute scripts

```bash
yarn install
```

Install the dependencies for both backend and frontend

```bash
install:deps
```

Run both backend and frontend concurrently

```bash
yarn dev
```

### For Backend - Important Commands

The .env file should not be shared, it is only on git to facilitate between members, it will be excluded after.

Init database with prisma

```bash
npx prisma init --datasource-provider postgresql
```

Migrate

```bash
npx prisma migrate dev --name init
```
