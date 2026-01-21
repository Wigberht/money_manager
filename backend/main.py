from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, database, utils
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run startup logic
    db = database.SessionLocal()
    try:
        utils.populate_sample_data(db)
    finally:
        db.close()
    yield
    # Run shutdown logic (if any)

app = FastAPI(lifespan=lifespan)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: str
    date: str

class Transaction(TransactionCreate):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"message": "Welcome to the Money Manager API"}

@app.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = models.User(username=user.username, password=user.password) # Plain text for simplicity as per project style
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    return {"status": "success", "username": db_user.username, "id": db_user.id}

@app.get("/transactions/{user_id}", response_model=list[Transaction])
def get_transactions(user_id: int, db: Session = Depends(database.get_db)):
    transactions = db.query(models.Transaction).filter(models.Transaction.owner_id == user_id).all()
    return transactions

@app.post("/transactions/{user_id}", response_model=Transaction)
def create_transaction(user_id: int, transaction: TransactionCreate, db: Session = Depends(database.get_db)):
    db_transaction = models.Transaction(**transaction.dict(), owner_id=user_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
