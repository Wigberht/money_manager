from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, database
from pydantic import BaseModel

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: str

class Transaction(TransactionCreate):
    id: int
    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"message": "Welcome to the Money Manager API"}

@app.get("/transactions", response_model=list[Transaction])
def get_transactions(db: Session = Depends(database.get_db)):
    transactions = db.query(models.Transaction).all()
    return transactions

@app.post("/transactions", response_model=Transaction)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(database.get_db)):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.post("/login")
def login(data: dict):
    # Simple mock login
    return {"status": "success", "username": data.get("username")}
