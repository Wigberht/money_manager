import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ExpenseChart = ({ transactions, onBack }) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses }
  ];

  // Group expenses by description (category-like)
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.description);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.description, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 expenses

  const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28', '#8884d8'];

  return (
    <div className="container">
      <header>
        <h1>Financial Overview</h1>
        <button onClick={onBack} className="logout-btn" style={{ backgroundColor: '#6c757d' }}>Back to Dashboard</button>
      </header>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <section className="balance-card" style={{ width: '100%', boxSizing: 'border-box' }}>
          <h3>Income vs Expenses</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="balance-card" style={{ width: '100%', boxSizing: 'border-box' }}>
          <h3>Top 5 Expenses</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#FF8042">
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExpenseChart;
