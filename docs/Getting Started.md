# Getting Started

This guide will walk you through setting up the MAO Admin Panel project on your local machine for development and testing purposes.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

You will also need a running [MongoDB](https://www.mongodb.com/) instance. You can use a local installation or a cloud service like MongoDB Atlas.

## Installation & Setup

1.  **Clone the repository:**
    Open your terminal and run the following command to clone the project:

    ```bash
    git clone https://github.com/olegnck404/mao-admin-panel.git
    cd mao-admin-panel
    ```

2.  **Install backend dependencies:**
    Navigate to the `backend` directory and install the required npm packages.

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    Navigate to the `frontend` directory and install the required npm packages.

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configure Environment Variables:**
    The backend requires a connection to a MongoDB database. Create a `.env` file in the `backend` directory and add your MongoDB connection string:
    ```env
    MONGO_URI=your_mongodb_connection_string
    ```
    Example: `MONGO_URI=mongodb://localhost:27017/mao-admin-panel`

## Running the Application

You can run the application in two ways: manually by starting each service, or using Docker for a more streamlined setup.

### Running with Docker (Recommended)

This is the easiest way to get the entire application stack running.

**Prerequisites:**

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Steps:**

1.  From the root of the project directory, run the following command:
    ```bash
    docker-compose up -d
    ```
2.  That's it! This single command will:
    - Build the Docker images for the frontend and backend services.
    - Start the containers for the `frontend`, `backend`, and `mongo` services in the background.

You can now access the services:

- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

To stop the services, run:

```bash
docker-compose down
```

### Manual Setup

You need to run the backend and frontend servers in separate terminals.

1.  **Start the Backend Server:**
    From the `backend` directory, run:

    ```bash
    npm run dev
    ```

    The backend server will start, typically on port 5000.

2.  **Start the Frontend Development Server:**
    From the `frontend` directory, run:
    ```bash
    npm run dev
    ```
    The frontend development server will start, typically on port 5173. You can now access the application in your browser at `http://localhost:5173`.
