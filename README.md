# Interview Management API

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A robust backend service built for the Robinhood technical assessment. This application provides a complete API for managing interview processes, including authentication, role-based access control, and a full audit trail.

### ✨ Features

- **Authentication:** Secure user login with JWT.
- **Role-Based Access Control:** Differentiated permissions for Admins and Interviewers.
- **Full CRUD API:** For managing Interviews, Comments, and viewing History.
- **Dedicated "Save" Endpoint:** For archiving interviews.
- **Pagination:** Scalable listing of interviews.
- **Comprehensive Audit Trail:** All changes to interviews and comments are logged.
- **Containerized Environment:** Fully containerized with dedicated Dockerfiles for the API and Database, orchestrated with Docker Compose.
- **Live API Documentation:** Interactive API documentation powered by Swagger/OpenAPI.
- **CI Pipeline:** Automated builds and quality checks with GitHub Actions.

### 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Containerization:** Docker, Docker Compose
- **API Documentation:** Swagger (OpenAPI 3.0)
- **Testing:** Jest, `ts-jest`
- **Linting:** ESLint

### 🚀 Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/) (v22.x or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

#### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the project root by copying the example:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the values in the `.env` file. The defaults are configured to work with the provided Docker Compose setup.

4.  **Run the Full Stack:**
    This single command will build the Docker images, start the API and Database containers, and apply the database schema and seed data.
    ```bash
    # (Optional) Clean up old data first
    # docker compose down -v
    
    # Build and start the services
    docker compose up -d --build
    ```

5.  **Initialize the Database:**
    After the containers are up, run these commands in your local terminal to set up and seed the database.
    ```bash
    # Apply the schema to the database
    npx prisma db push

    # Seed the database with sample data
    npx prisma db seed
    ```

The application is now running!
- 🚀 **API is available at:** `http://localhost:3000`
- 📚 **Swagger Docs are available at:** `http://localhost:3000/api-docs`
- 💻 **Prisma Studio (optional):** `npx prisma studio`

### 📜 Available Scripts

- `npm run dev`: Starts the server in development mode with hot-reloading (requires the DB to be running via `docker compose up -d db`).
- `npm run build`: Compiles the TypeScript project to JavaScript in the `/dist` folder.
- `npm test`: Runs the Jest unit tests.
- `npm run lint`: Lints the codebase for style and error checks.

### 🔑 Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for the PostgreSQL database. | `postgresql://user:password@localhost:5432/mydatabase?schema=public` |
| `PORT` | The port the application will run on. | `3000` |
| `APP_URL` | The full base URL of the application. | `http://localhost:3000` |
| `API_PREFIX` | Global prefix for all API routes. | `api` |
| `JWT_SECRET` | A long, random secret key for signing JWTs. | `your-super-secret-key-that-is-very-long` |
| `JWT_EXPIRES_IN`| How long a JWT is valid for. | `1d` |
| `ADMIN_EMAIL` | The email for the default admin user created by the seed script. | `admin@example.com` |
| `ADMIN_PASSWORD`| The password for the default admin user. | `superadminpassword123` |