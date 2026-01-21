import React, { useState, useMemo } from 'react';
import { Cell, ResponsiveContainer, Tooltip, PieChart, Pie, Legend } from 'recharts';

const ExpenseChart = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Extract unique months from transactions that have data
  const availableMonths = useMemo(() => {
    const months = transactions
      .map(t => t.date.substring(0, 7)) // Get YYYY-MM
      .filter((v, i, a) => a.indexOf(v) === i) // Unique values
      .sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
    return ['All', ...months];
  }, [transactions]);

  // Filter transactions based on selection
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'All') return transactions;
    return transactions.filter(t => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Helper to group and sum transactions by description
  const groupData = (type) => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((acc, t) => {
        const name = t.description.trim() || 'Unspecified';
        const existing = acc.find(item => item.name.toLowerCase() === name.toLowerCase());
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({ name: name, value: t.amount });
        }
        return acc;
      }, [])
      .sort((a, b) => b.value - a.value);
  };

  const expenseData = groupData('expense');
  const incomeData = groupData('income');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const CustomPieChart = ({ data, title }) => (
    <section className="balance-card" style={{ width: '100%', boxSizing: 'border-box' }}>
      <h3>{title}</h3>
      {data.length > 0 ? (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No data to display</p>
      )}
    </section>
  );

  return (
    <div className="chart-container">
      <div className="filter-section">
        <label htmlFor="month-select">Filter by Month: </label>
        <select 
          id="month-select" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-dropdown"
        >
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {month === 'All' ? 'Show All' : month}
            </option>
          ))}
        </select>
      </div>
      <div className="charts-grid">
        <CustomPieChart 
          data={expenseData} 
          title="Expenses by Name" 
        />
        <CustomPieChart 
          data={incomeData} 
          title="Incomes by Name" 
        />
      </div>
    </div>
  );
};

export default ExpenseChart;
