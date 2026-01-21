import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'Money Manager';

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData.username);
    setUserId(userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    setUserId(null);
    setTransactions([]);
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      type
    };

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      if (response.ok) {
        const savedTransaction = await response.json();
        setTransactions([savedTransaction, ...transactions]);
        setDescription('');
        setAmount('');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  return (
    <div className="container">
      <header>
        <h1>{APP_NAME}</h1>
        <div className="user-info">
          <span>Welcome, {user}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <section className="balance-card">
        <h2>Balance: ${totalBalance.toFixed(2)}</h2>
      </section>

      <div className="main-content">
        <section className="form-section">
          <h3>Add Transaction</h3>
          <form onSubmit={addTransaction} className="transaction-form">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button type="submit">Add Transaction</button>
          </form>
        </section>

        <section className="list-section">
          <h3>History</h3>
          <ul className="transaction-list">
            {transactions.map((t) => (
              <li key={t.id} className={`transaction-item ${t.type}`}>
                <span>{t.description}</span>
                <span>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
