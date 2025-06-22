# Backend Guide

The backend for the MAO Admin Panel is a Node.js application built with Express and TypeScript. It follows the principles of Clean Architecture to separate concerns and ensure maintainability.

## Project Structure (`backend/src`)

The backend source code is organized into the following directories:

- `config/`: Contains configuration files, such as the database connection setup (`db.ts`).
- `controllers/`: Handles the request/response logic. Controllers receive requests, use services to perform business logic, and send back responses.
- `models/`: Defines the Mongoose schemas and models for the MongoDB database (e.g., `User.ts`, `Task.ts`).
- `routes/`: Defines the API routes and maps them to controller functions.
- `scripts/`: Contains utility scripts, such as the script to seed the database with an initial admin user.
- `app.ts`: The main entry point of the application, where Express is configured and middleware is set up.

## Database Models

The application uses Mongoose to model data. Key models include:

- **User**: Represents an employee or administrator in the system. Stores information like name, email, role, and password hash.
- **Task**: Represents a task assigned to one or more employees. It can be personal or global and includes details like title, description, due date, priority, and status.
- **Attendance**: Logs employee check-in and check-out times, status (on-time, late, absent), and any associated tardiness duration.
- **Reward/Fine**: Represents a bonus or penalty applied to a user, including the amount, reason, and date.

## API Endpoints

The backend exposes a RESTful API for the frontend to consume. Here are some of the main resources and endpoints:

### Users (`/api/users`)

- `GET /`: Fetches a list of all users.
- `GET /:id`: Retrieves a single user by their ID.
- `GET /stats`: Retrieves statistics about users.
- `POST /`: Creates a new user.
- `PUT /:id`: Updates an existing user.
- `DELETE /:id`: Deletes a user.

### Tasks (`/api/task`)

- `GET /`: Fetches all tasks, with filtering capabilities.
- `POST /`: Creates a new task.
- `PUT /:id`: Updates a task, including its status or assignees.
- `DELETE /:id`: Deletes a task.

### Attendance (`/api/attendance`)

- `GET /`: Fetches all attendance records.
- `POST /`: Creates a new attendance record.
- `DELETE /:id`: Deletes an attendance record.

### Rewards/Fines (`/api/rewards`)

- `GET /`: Fetches all rewards and fines.
- `POST /`: Creates a new reward or fine.
- `DELETE /:id`: Deletes a reward or fine record.

### Dashboard (`/api/dashboard`)

- `GET /stats`: Retrieves aggregate statistics for the main dashboard, such as total employees, pending tasks, and recent rewards.
- `GET /task-progress`: Fetches data on task completion progress by category.

## Controllers and Routes

- **Routes** (`routes/*.routes.ts`): Define the URL structure of the API. Each route file is dedicated to a specific resource (e.g., `user.routes.ts`) and uses an Express router.
- **Controllers** (`controllers/*.controller.ts`): Contain the logic to handle incoming requests. They are responsible for validating input, calling the appropriate services or models to interact with data, and formatting the response to be sent back to the client.
