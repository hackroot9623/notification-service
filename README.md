# Notification Service

A microservice for handling notifications through various channels like Email and System. This service allows creating, listing, deleting, and marking notifications as read/unread.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/notification-service.git
    cd notification-service
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Install Prisma CLI globally if you haven't already:
    ```sh
    npm install -g prisma
    ```

## Configuration

1. Create a `.env` file in the root directory and add your database connection string:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    ```

2. Run Prisma migrations to set up the database schema:
    ```sh
    npx prisma migrate dev --name init
    npx prisma generate
    ```

## Running the Application

1. Start the server:
    ```sh
    npm run dev
    ```

    The server will start on `http://localhost:3000`.

## API Endpoints

### User Endpoints

- **Create User**
    ```http
    POST /api/users
    ```

    **Request Body:**
    ```json
    {
      "email": "example@example.com",
      "name": "John Doe"
    }
    ```

    **Response:**
    ```json
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "example@example.com",
      "name": "John Doe",
      "createdAt": "2024-05-12T08:40:51.620Z",
      "updatedAt": "2024-05-12T08:40:51.620Z"
    }
    ```

### Notification Endpoints

- **Create Notification**
    ```http
    POST /api/notifications
    ```

    **Request Body:**
    ```json
    {
      "event": "NewEmail",
      "deliveryVia": "EMAIL",
      "type": "INSTANT",
      "metadata": {
        "email": "example@example.com",
        "content": "This is an email notification content."
      }
    }
    ```

    **Response:**
    ```json
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "event": "NewEmail",
      "deliveryVia": "EMAIL",
      "type": "INSTANT",
      "metadata": {
        "email": "example@example.com",
        "content": "This is an email notification content."
      },
      "createdAt": "2024-05-12T08:40:51.620Z",
      "updatedAt": "2024-05-12T08:40:51.620Z",
      "userId": null
    }
    ```

- **List Notifications**
    ```http
    GET /api/notifications
    ```

    **Response:**
    ```json
    [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "event": "NewEmail",
        "deliveryVia": "EMAIL",
        "type": "INSTANT",
        "metadata": {
          "email": "example@example.com",
          "content": "This is an email notification content."
        },
        "createdAt": "2024-05-12T08:40:51.620Z",
        "updatedAt": "2024-05-12T08:40:51.620Z",
        "userId": null
      }
    ]
    ```

- **Delete Notification**
    ```http
    DELETE /api/notifications/:id
    ```

- **Mark Notification as Read**
    ```http
    PATCH /api/notifications/:id/read
    ```

- **Mark Notification as Unread**
    ```http
    PATCH /api/notifications/:id/unread
    ```

## Project Structure

```plaintext
notification-service/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── notifications.ts
│   │   ├── users.ts
│   ├── middleware/
│   │   ├── auth.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── notifications.ts
│   │   ├── users.ts
│   ├── connections.ts
│   ├── app.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

# Testing
1. Unit Tests: Write tests using Jest in the __tests__ directory.
2. Run Tests:
```sh
npm test
```
# License
This project is licensed under the MIT License.

### Notes
- Ensure the environment variable `DATABASE_URL` is correctly set to your database connection string.
- Customize the project name and URLs according to your actual project repository and environment.
- Update the documentation with any additional endpoints or changes in the project structure as your project evolves.
