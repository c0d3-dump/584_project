# Deploying frontend to Vercel

1. Sign in at https://vercel.com and click "New Project".
2. Connect your GitHub account and select your repository.
3. Choose root directory: `frontend`.
4. Set the build command: `npm install && npm run build -- --configuration production`.
5. Set the output directory: `dist/car-sales-frontend`.
6. Add environment variables (if necessary):
   - `API_URL` -> `https://five84-project.onrender.com/api` (optional; our environment.prod uses the Render backend URL already).
7. Deploy and Vercel will build and publish a URL for your app.

Notes:
- For SPA support, we provided a `vercel.json` file to route all requests to `index.html`.
- If you want to use a custom domain, configure it in Vercel and update the backend CORS AllowedOrigins (see below).
