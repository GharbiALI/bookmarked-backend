# Bookmarked Backend 📚
The following project is the backend service that manages CRUD operations for a personal reading tracker, and provides a REST API that can be consumed from any FE client **(using a standard HTTP client)**.
This backend service is built with Express and TypeScript, please take a look at the section stack below 👇 to know how to run it.

## Project stack information
The project is built with Express, a minimal and flexible Node.js web framework.
The project main language is Typescript (Javascript + Types) for all the business logic, Mongoose to manage MongoDB entities, and JSON Web Tokens (JWT) to manage authentication.
To feel more familiar with these technologies and stacks, please find below all relevant documentations:
- Express JS (Backend/Server side framework) -> [Express DOCS](https://expressjs.com/) 💫
- TypeScript (Javascript with types) -> [TypeScript DOCS](https://www.typescriptlang.org/docs/) 🧠
- Mongoose (MongoDB ODM) -> [Mongoose DOCS](https://mongoosejs.com/docs/) 🗄️
- JSON Web Token (Authentication) -> [JWT DOCS](https://jwt.io/introduction) 🔐

## Setup ⏳
Please make sure you have the minimum requirements to be able to run the project. This means you already installed Node latest stable version.
Optional: You could also install Docker in case you would like to create a portable image and test it on different machines.
- You can install node from here: [Download Node](https://nodejs.org/en) 🏗️
- You will also need a running MongoDB instance (locally, via Docker, or a cloud provider such as MongoDB Atlas).

## How to run the project ⏲
This a simple NPM project, this mean you just need to install the packages used first, then create your environment file, then the project will be able to be started:
1. Open a new terminal.
2. Cd (ie: locate) to the path of the project root.
3. Run the following command ``npm i``. The previous command will take a bit of time to install all the packages.
4. Create a ``.env`` file in the project root with the following variables:
```
PORT=4000
MONGO_URI=mongodb://<your_db_user>:<your_db_password>@localhost:27017/bookmarked?authSource=admin
JWT_SECRET=your-secret-key
jwtExpiresIn=1h
```
5. After that, run the command ``npm run dev``.
If everything is fine, then a server will be starting and listening in the following address `http://localhost:4000`.

### Running with Docker (alternative)
Instead of steps 3-5, you can simply run:
```
docker-compose up --build
```
This will start both the API and a MongoDB container automatically.

## Test the project 🧨
The project contains different test cases for functionality and components:\
1. run the command ``npm test``
This is the output after finishing the test execution:
```
Test Suites: 12 passed, 12 total
Tests:       90 passed, 90 total
Snapshots:   0 total
Time:        42.75 s
Ran all test suites.
```
Note: tests run against ``mongodb-memory-server``, so no external database connection is required to run them.

## API Reference

Base URL: `/api`

### Auth

| Method | Endpoint       | Description               | Auth required |
|--------|----------------|----------------------------|----------------|
| POST   | `/auth/signup` | Register a new user        | No             |
| POST   | `/auth/login`  | Log in and receive a JWT   | No             |

### Books

All book routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint     | Description                            |
|--------|--------------|------------------------------------------|
| GET    | `/books`     | List all books for the logged-in user   |
| GET    | `/books/:id` | Get a single book by id                 |
| POST   | `/books`     | Create a new book                       |
| PUT    | `/books/:id` | Update an existing book                 |
| DELETE | `/books/:id` | Delete a book                           |

Every book is scoped to the authenticated user — you can only view, create, update, or delete books that belong to you.

## Developer important notes 🎯
- The project uses a layered structure (routes -> middlewares -> controllers -> services -> repository -> schemas) so keep new features consistent with this flow.
- All book routes require authentication: always send an ``Authorization: Bearer <token>`` header, obtained from ``/api/auth/login`` or ``/api/auth/signup``.
- Passwords must be at least 12 characters and include an uppercase letter, lowercase letter, number and symbol — this is enforced on signup.
- The project uses MongoDB as DB so you might need a GUI client like [MongoDB Compass](https://www.mongodb.com/products/tools/compass) to check the collections or do DB operations.

## Building and Deployment
- CI is handled via GitHub Actions (``.github/workflows/ci.yml``): every pull request targeting ``main`` automatically installs dependencies and runs the full test suite.
- For deployment, the provided ``Dockerfile`` and ``docker-compose.yml`` can be used to build and run the API and MongoDB together on any cloud provider that supports Docker containers.