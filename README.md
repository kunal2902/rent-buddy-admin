# NCA CRM

Steps to set-up:

- Either setup the repo and pull the main branch OR directly clone the repo:

```bash
git init -b main && git remote add origin https://github.com/Ankan002/nca-crm.git && git pull origin main
```

OR

```bash
git clone https://github.com/Ankan002/nca-crm.git
```

- Now install all the dependencies:

```bash
yarn
```

- Fetch and checkout to `development` branch:

```bash
git fetch origin development:development && git checkout development
```

- Setup the `.env` of the app.

- Finally you can start the development server:

```bash
yarn dev
```
