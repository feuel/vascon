# Vascon

Vending machine application
This is a monorepo of the frontend `(/frontend)` and backend `(/backend)` managed with Nx.

## Steps to run this application

- Configure the NestJS application by providing the following environment varaibles in `/backend/.env`

```js
PORT; //Server Port e.g 3001
REDIS_HOST; // Redis Host e.g localhost
REDIS_PORT; // Redis Port e.g 6379
USER_TOKEN_SECRET; // JWT Token Secret
TOKEN_EXPIRY_DURATION; // Token expirarion e.g 1 day, 2 months
DATABASE_NAME; // Database name
DATABASE_CONNECTION_URI; // MongoDB connection URI
DATABASE_USER; // Database user
DATABASE_PASSWORD; // Database password
```

To override these options for the test environment, simply create a `/backend/.test.env` file update the variables there

- Start the backend server by running

```js
npx nx run backend:serve
```

- Start the NextJs app by running

```js
npx nx run frontend:start
```

- Run the server e2e test by running

```js
npx nx run backend:test
```
