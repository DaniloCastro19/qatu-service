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
