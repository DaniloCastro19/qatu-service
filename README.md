# Qatu API

An API service for Qatu Application.


# Getting started

## Prerequisites
* NodeJS (18.20 or higher) and npm. 
* Docker.

## Instalation

### Clone repository
```
git clone [URL | SSH]
```
### Dependency installation

On **qatu-service** project folder:

```
npm install
```

### Environment settings

Copy and paste the `.env.example` template on your own new `.env` file.

For a clean start your **CONNECTION_STRING** variable must be look like this in your **.env** file:

```
CONNECTION_STRING=mongodb://localhost:27017/DB_NAME
```

Feel free to replace "DB_NAME" with any other name you want for the database, is up to you.

### Run the app with docker:
```
sudo docker run -d   -p 3000:3000   --env-file .env   --name qatu-api   qatu-api
```

### Run development services

```
docker-compose -f docker-compose.dev.yml up -d
```

### Run the app

```
npm run dev
```

The output must be something like:

`[API ROUTES]`

`Server running on http://localhost:[PORT]/api`

`Connected to DB client`

### Implementation with environment variables (environments and .env)

Make sure that for each variable added within the .env file, it must be sent to the environments file so it can be exported and used anywhere in the project. This also helps us define the values ​​for these same variables, for example:

### venv:
```
PORT=3000
CONNECTION_STRING=mongodb://localhost:27017/QatuDataBase
JWT_SECRET=misecret
```

### environments
```
import 'dotenv/config';
import env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  CONNECTION_STRING: env.get('CONNECTION_STRING').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
};
```

### Use Case
```
import app from './app.js';
import dbClient from "./config/dbClient.js"
import { envs } from './config/environments/environments.js';

const PORT = envs.PORT || 3000;
const API_PREFIX = "api";
```

### Wiki

You can find more information in the [project Wiki.](https://gitlab.com/groups/jala-university1/cohort-2/oficial-es-desarrollo-de-software-4-cssd-245.ga.t1.25.m2/secci-n-a/union-sveltica/-/wikis/home)
