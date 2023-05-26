---
sidebar_position: 1
---

# Intro

## What is SHARESAFE?

- a web app that helps you share files safely. You can send any kind of file, like documents, photos, or videos;
- makes sure only the people you want can see your files (groups);
- easy to use and cares about your privacy.

> Share more, worry less.

## App Structure

```
SHARESAFE
├── backend                    # Server related files
│   ├── files                  # Encrypted files
|   ├── prisma                 # Database "schema" and migrations
|   ├── src                    # Source code
|   ├──   ├── modules          # Modules
|   ├──   ├── utils            # Utility functions (e.g. password hashing)
|   |──   ├── tests            # Server tests - using Tap
|   |──   ├── ...              # Other essential files (e.g. server)
├── frontend                   # Client related files
│   ├── sharesafe-docs         # Documentation files
│   ├── src                    # Source code for the app
│   ├──   ├── auth             # Authentication related files
│   ├──   ├── components       # React components
|   ├──   ├── encryption       # Encryption related files
|   ├──   ├── subPages         # Subpages
|   ├──   ├── test             # Client tests - using Vitest
|   ├──   ├── ...              # Other essential files (e.g. App.tsx)
```

## Tech Stack

- [Docusaurus](https://docusaurus.io/) - Create documentation websites
- [Fastify](https://www.fastify.io/) - Web framework
- [Node.js](https://nodejs.org/en/) - JavaScript runtime
- [PostgreSQL](https://www.postgresql.org/) - Open source relational database
- [Prisma](https://www.prisma.io/) - Database toolkit
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

## Cryptographic Tools

### Backend

The library used for cryptography is [crypto](https://nodejs.org/api/crypto.html), which was used to hash secure passwords, using hashes.

### Frontend

The library used for encryption is [Node-forge](https://github.com/digitalbazaar/forge) which is a JavaScript toolkit for encryption, decryption, digital signatures, and more.

## Getting Started

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

### Clone the Repository

Go to your desired folder in your computer and clone the repo using:

```bash
git clone https://github.com/carvalho28/SHARESAFE
```

### Install the Dependencies

After cloning the repo, navigate to the created folder using:

```bash
cd SHARESAFE
```

Then install all the necessary dependencies using:

```bash
yarn install:deps
```

### Development Server

To run the development server after installing the dependencies, use:

```bash
yarn dev
```

The development server of the app will be running at http://localhost:5173/.

The development server of the docs will be running at http://localhost:5174/.

<!--
Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes. -->
