import React, { useState } from 'react';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addTransaction = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      type,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setDescription('');
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <header>
        <h1>Money Manager</h1>
        <div className="user-info">
          <span>Welcome, {user}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="balance-card">
        <h2>Balance: ${totalBalance.toFixed(2)}</h2>
      </div>

      <div className="main-content">
        <section className="form-section">
          <h3>Add Transaction</h3>
          <form onSubmit={addTransaction} className="transaction-form">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit">Add</button>
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
