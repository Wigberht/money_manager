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
