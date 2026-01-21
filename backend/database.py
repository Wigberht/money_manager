from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database file location
# For persistence on Vercel, use an external database (e.g., PostgreSQL) via DATABASE_URL
# If no DATABASE_URL is provided, it falls back to local SQLite (ephemeral on Vercel)
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    if os.environ.get("VERCEL"):
        DATABASE_URL = "sqlite:////tmp/money_manager.db"
    else:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        DB_PATH = os.path.join(BASE_DIR, 'database', 'money_manager.db')
        # Ensure the database directory exists locally
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        DATABASE_URL = f"sqlite:///{DB_PATH}"

# SQLAlchemy 2.0+ requires 'postgresql+psycopg2://' for Postgres URLs if using psycopg2
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
