# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY frontend .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output to replace the default Nginx content.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]