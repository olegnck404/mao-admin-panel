# Frontend Guide

The frontend of the MAO Admin Panel is a modern Single Page Application (SPA) built with React and TypeScript, using Vite for a fast development experience. It is designed following the principles of Clean Architecture to ensure a clear separation of concerns.

## Project Structure (`frontend/src`)

The frontend source code is organized into the layers of Clean Architecture:

- **`domain/`**: The core of the frontend application. It contains the business logic and types that are independent of any UI framework.

  - `entities/`: Client-side representations of the core business objects (e.g., `User`, `Task`).
  - `dto/`: Data Transfer Objects used for API communication (e.g., `PaginationParams`, `UserFilters`).
  - `repositories/`: Interfaces for the data repositories (e.g., `IUserRepository`), defining a contract for how data should be fetched and manipulated.
  - `errors/`: Custom error classes for the application (e.g., `ApplicationError`).

- **`application/`**: Contains the application-specific business logic.

  - `services/`: Services that orchestrate the application's use cases (e.g., `UserService`), coordinating between the UI and the data layer.

- **`infrastructure/`**: Implements the contracts defined in the domain layer.

  - `api/`: Contains classes responsible for making HTTP requests to the backend API (e.g., `UserApi`).
  - `repositories/`: Concrete implementations of the repository interfaces (e.g., `UserRepositoryImpl`).

- **`presentation/`**: The UI layer of the application, built with React and Material-UI.
  - `components/`: Reusable React components used throughout the application (e.g., `UserList`, `Layout`).
  - `pages/`: Top-level components that represent the different pages of the application (e.g., `Dashboard`, `Tasks`, `UsersList`).
  - `hooks/`: Custom React Hooks that encapsulate complex state logic and side effects (e.g., `useUsers`).
  - `contexts/`: React Contexts for managing global state, such as authentication (`AuthContext`).

## State Management

The application uses a combination of React's built-in state management features (`useState`, `useReducer`) and the **Context API**.

- **Local Component State**: For state that is only relevant to a single component (e.g., form input values), `useState` is used.
- **Global State (Auth)**: For state that needs to be accessible across the entire application, such as the current authenticated user and their permissions, `AuthContext` is used. This avoids prop-drilling and provides a clean way to manage global concerns.
- **Fetched Data State**: Data fetched from the API is managed within custom hooks (e.g., `useUsers`). These hooks handle loading states, errors, and the data itself, providing a simple interface for components to consume.

## React Hooks

Custom hooks are a key part of the frontend architecture. They are used to:

- **Encapsulate Data Fetching**: Hooks like `useUsers` abstract away the logic of fetching data from the API, managing loading and error states, and providing the data to the components.
- **Share Logic**: Reusable logic that can be shared between multiple components is extracted into custom hooks to avoid code duplication.
- **Improve Readability**: By separating complex logic from the UI, hooks make components cleaner and easier to understand.

## API Interaction

All communication with the backend is handled through the `infrastructure` layer.

1.  A React component calls a method from an `application` service (e.g., `userService.getUsers()`).
2.  The service then calls a method from an `infrastructure` repository (e.g., `userRepository.findAll()`).
3.  The repository implementation calls the corresponding `api` client method (e.g., `userApi.fetchUsers()`).
4.  The API client uses `axios` or `fetch` to make the actual HTTP request to the backend.

This layered approach ensures that the UI components are completely decoupled from the data fetching implementation, making the application more flexible and easier to maintain.
