# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Install ts-node globally
RUN npm install -g ts-node

# Bundle app source
COPY backend .

# Copy production environment variables
COPY backend/.env.production .env.production

# Build TypeScript code
RUN npm run build

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variables (can be overridden)
ENV PORT=8080

# Run the app when the container launches
CMD [ "node", "dist/server.js" ]