import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import models

def populate_sample_data(db: Session):
    # Check if user "a" already has data to avoid over-populating on every restart
    # but the user said "permanently run on startup", usually to handle ephemeral storage.
    # We'll check if user "a" exists and has at least some transactions.
    
    user_a = db.query(models.User).filter(models.User.username == "a").first()
    if not user_a:
        user_a = models.User(username="a", password="a")
        db.add(user_a)
        db.commit()
        db.refresh(user_a)
    
    transaction_count = db.query(models.Transaction).filter(models.Transaction.owner_id == user_a.id).count()
    
    # If user "a" has less than 50 transactions, we populate more.
    # This keeps it "fresh" but avoids infinite growth if storage is persistent.
    if transaction_count < 50:
        print(f"Populating sample data for user 'a' (current count: {transaction_count})...")
        
        categories = {
            "income": ["Salary", "Freelance", "Gift", "Bonus"],
            "expense": ["Food", "Rent", "Transport", "Utilities", "Entertainment", "Shopping", "Health"]
        }
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=120) # ~4 months
        
        new_transactions = []
        for _ in range(70):
            t_type = random.choices(["income", "expense"], weights=[0.2, 0.8])[0]
            desc = random.choice(categories[t_type])
            
            # Random date within last 4 months
            days_delta = random.randint(0, 120)
            t_date = (start_date + timedelta(days=days_delta)).strftime("%Y-%m-%d")
            
            if t_type == "income":
                amount = round(random.uniform(500, 3000) if desc == "Salary" else random.uniform(50, 500), 2)
            else:
                if desc == "Rent":
                    amount = 800.0
                else:
                    amount = round(random.uniform(5, 150), 2)
            
            new_transactions.append(models.Transaction(
                description=desc,
                amount=amount,
                type=t_type,
                date=t_date,
                owner_id=user_a.id
            ))
        
        db.add_all(new_transactions)
        db.commit()
        print(f"Added {len(new_transactions)} transactions for user 'a'.")
    else:
        print(f"User 'a' already has {transaction_count} transactions. Skipping population.")
