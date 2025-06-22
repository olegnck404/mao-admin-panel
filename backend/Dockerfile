# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variables (can be overridden)
ENV MONGO_URI=mongodb://mongo:27017/mao-admin-panel
ENV PORT=5000

# Run the app when the container launches
CMD [ "node", "dist/app.js" ] 