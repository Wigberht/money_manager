# Money Manager Backend

Simple REST API built with FastAPI.

## Prerequisites
- Python 3.14 (as requested)
- pip

## Setup and Run

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. (Optional) Create a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Start the server:
   ```powershell
   python -m uvicorn main:app --reload
   ```

The API will be available at `http://127.0.0.1:8000`.
You can view the interactive API documentation at `http://127.0.0.1:8000/docs`.

## Persistence on Vercel
Vercel's filesystem is read-only and ephemeral. To persist your data (transactions) after redeployments or server restarts:

1.  **Get a managed database**: Sign up for a free PostgreSQL database at [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
2.  **Get the Connection String**: Copy the "External" or "Pooling" connection string (it looks like `postgres://user:password@host:port/dbname`).
3.  **Add Environment Variable to Vercel**:
    - Go to your Vercel Project Settings.
    - Go to **Environment Variables**.
    - Add a new variable named `DATABASE_URL`.
    - Paste your connection string as the value.
4.  **Redeploy**: Once the environment variable is added, redeploy your project. The app will automatically detect `DATABASE_URL` and use the persistent PostgreSQL database.
