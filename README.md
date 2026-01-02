# Rental residence hub

## Intro

This project is clone of well known AirBnb. As a full stack developer it's very good opportunity to present knowledge and skills to create interactive, responsive web application. A user will be able to 
perform CRUD (create, read, update and delete) records that are stored in database.

## Technologies stack

* Frontend: Redux, React, React-route, CSS, Vite
* Backend: Express, Sequelize
* Database: PostgreSQL

## State management

DB Diagram

![db diagram](docs/DB_Diagram.png)

## How to start the application locally

To install the dependencies

```bash
cd backend && npm install
npm run db:setup
```

To start the backend server

```bash
NODE_ENV=development npm start
```

### Frontend

To install the dependencies

```bash
cd frontend && npm install
```

To start the frontend

```bash
npm run dev
```

or start the server with build the distribution artifacts and watch for changes functionality from vite

```bash
npm run build
```