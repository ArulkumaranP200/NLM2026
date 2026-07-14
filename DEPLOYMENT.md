# Deployment Guide

This repository is already configured for deployment using GitHub as the source.

## Frontend

The React frontend lives in the `frontend` directory.

- `vercel.json` is already configured to build the app from `frontend/package.json`.
- `.vercel/repo.json` contains the Vercel project configuration.

To deploy the frontend:

1. Connect the GitHub repository to Vercel.
2. Set the project root to `frontend` when importing the repository.
3. Confirm the build command is `npm run build`.
4. Add any required Vercel environment variables.
5. Push to `main` to trigger a deploy.

## Backend

The Django backend is configured for Render using `render.yaml`.

To deploy the backend:

1. Connect the GitHub repository to Render.
2. Import `render.yaml` from the repository.
3. Ensure the service uses branch `main` and root `.`.
4. Set the environment variables required by Django:
   - `SECRET_KEY`
   - `DEBUG=false`
   - `DB_HOST`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_PORT`
   - `ALLOWED_HOSTS`
   - `CORS_ALLOWED_ORIGINS`
   - `GOOGLE_CLIENT_ID`
   - `SECURE_SSL_REDIRECT=true`
5. Create or connect the database service named `nlm-db`.
6. Push to `main` to trigger a deploy.

## GitHub Actions

A GitHub Actions workflow is provided at `.github/workflows/deploy.yml`.

### Required secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`

> Note: Vercel Hobby plan does not support GitHub collaboration for private repositories. If you are blocked because the commit author does not have Vercel access, use a Vercel token from the project owner account, or upgrade to Pro.
>
> If you want to avoid this issue, deploy the frontend through GitHub Actions using the `VERCEL_TOKEN` secret rather than relying on Vercel's GitHub integration for private repos.

The workflow will:

- build the frontend
- deploy the frontend to Vercel using the locally built output
- trigger a backend deploy on Render

> Use the GitHub Actions workflow instead of Vercel's direct GitHub build when the Hobby plan blocks private-repo installs. The `deploy_manual.yml` workflow is provided so you can manually trigger a deploy from GitHub Actions.

## Notes

- If you prefer, you can also deploy directly by connecting GitHub to Vercel and Render without using the GitHub Actions workflow.
- Make sure the backend `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` environment variables include your production frontend and backend hostnames.
