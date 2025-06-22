# Deployment Guide

This guide covers the process of deploying the MAO Admin Panel. The backend is designed to be deployed to a cloud service, while the frontend is set up for easy deployment to GitHub Pages.

## Backend Deployment

The backend is a standard Node.js application that can be deployed to any platform that supports Node.js, such as Heroku, AWS, or Google Cloud.

A general deployment process would involve:

1.  **Setting up a production database**: Create a MongoDB Atlas cluster or another cloud-hosted MongoDB instance.
2.  **Configuring Environment Variables**: Set the `MONGO_URI` and any other required environment variables on your deployment platform.
3.  **Building the application**: Run the build script to transpile the TypeScript code to JavaScript.
    ```bash
    npm run build
    ```
4.  **Starting the server**: Use a process manager like PM2 to run the compiled application.
    ```bash
    node dist/app.js
    ```

## Frontend Deployment with GitHub Pages

The frontend can be easily deployed as a static site using GitHub Pages.

### Step 1: Set the `homepage` URL

In the `frontend/package.json` file, add a `homepage` field to specify the URL where the app will be hosted. This is crucial for React Router to work correctly on GitHub Pages.

```json
"homepage": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>",
```

For this project, it would be:

```json
"homepage": "https://olegnck404.github.io/mao-admin-panel",
```

### Step 2: Add Deployment Scripts

In `frontend/package.json`, add the following scripts for easy deployment:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Step 3: Install `gh-pages`

Install the `gh-pages` package as a dev dependency to handle the deployment process.

```bash
# From the frontend directory
npm install gh-pages --save-dev
```

### Step 4: Deploy

Run the deploy script from your `frontend` directory:

```bash
npm run deploy
```

This command will first build the application and then push the contents of the `dist` folder to a special `gh-pages` branch on your GitHub repository, which will be used to serve the live site.

### Step 5: Configure GitHub Pages in Repository Settings

As a final step (if not done automatically), you may need to go to your GitHub repository's **Settings > Pages**. Under "Build and deployment", select `gh-pages` as the branch to deploy from and `/ (root)` as the folder.

Your application should now be live at the URL specified in your `homepage` field.
