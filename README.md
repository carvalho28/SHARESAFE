# SHARESAFE

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

<img align="left" alt="TypeScript" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" />
<img align="left" alt="React" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />
<img align="left" alt="NodeJS" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
<img align="left" alt="Postgre" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" />
... and more!

<br />
<br />

## Setup

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
