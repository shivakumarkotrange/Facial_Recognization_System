# Deployment Guide

## Vercel (Frontend)

This project uses a separate `frontend/` app built with Vite and React.

Steps:
1. In Vercel, create a new project and point it at the `frontend/` folder of this repository.
2. Ensure the framework is recognized as a static Vite site.
3. Set the environment variable:
   - `VITE_API_URL` = `https://<your-render-backend-url>`
4. Deploy.

The file `frontend/vercel.json` already configures Vercel for a static build using the `dist` output directory.

## Render (Backend)

The backend is configured in `render.yaml` and is ready for Render deployment.

Steps:
1. In Render, create a new Web Service and connect to the same repository.
2. Use the existing `render.yaml` file to configure the service.
3. The backend start command is:
   - `cd backend && python -m uvicorn app:app --host 0.0.0.0 --port $PORT`

The backend service will serve the FastAPI API on a managed public URL.

## Environment Notes

- The frontend reads the backend host from `VITE_API_URL`.
- The backend currently allows CORS from any origin, which supports Vercel frontend traffic.

## Recommended Flow

1. Deploy the backend to Render and note the public service URL.
2. Update `VITE_API_URL` in Vercel with that Render URL.
3. Redeploy Vercel.

## Local Testing

- Frontend: run `cd frontend && npm run dev`
- Backend: run `cd backend && python -m uvicorn app:app --reload`
