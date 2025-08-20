import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import  {api  }from '../services/api';
import '../css/moneymanagement.css'; // We'll create this CSS file

// Chart components (we'll use simple SVG-based charts for minimal dependencies)
const BarChart = ({ data, width = 300, height = 200, color = '#4ea1ff' }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const values = Object.values(data);
  const maxValue = Math.max(...values);
  const keys = Object.keys(data);
  
  return (
    <svg width={width} height={height} className="bar-chart">
      {keys.map((key, i) => {
        const barHeight = (data[key] / maxValue) * (height - 40);
        const barWidth = (width - 40) / keys.length - 5;
        return (
          <g key={key} transform={`translate(${i * (barWidth + 5) + 20}, ${height - barHeight - 20})`}>
            <rect width={barWidth} height={barHeight} fill={color} />
            <text x={barWidth / 2} y={barHeight + 25} textAnchor="middle" fontSize="10" fill="#b7bcc7">
              {key.length > 8 ? `${key.substring(0, 8)}...` : key}
            </text>
            <text x={barWidth / 2} y={-5} textAnchor="middle" fontSize="10" fill="#e8e9ec">
              ${data[key].toFixed(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const PieChart = ({ data, width = 200, height = 200 }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  let accumulatedAngle = 0;
  const colors = ['#4ea1ff', '#ff6b6b', '#6bff8d', '#ffd86b', '#9b6bff', '#ff6bd0', '#6bffd8'];
  
  return (
    <svg width={width} height={height} viewBox="0 0 200 200" className="pie-chart">
      <circle cx="100" cy="100" r="90" fill="transparent" stroke="#2a2f3a" strokeWidth="10" />
      {Object.entries(data).map(([key, value], i) => {
        const percentage = value / total;
        const angle = percentage * 360;
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const x1 = 100 + 90 * Math.cos(accumulatedAngle * Math.PI / 180);
        const y1 = 100 + 90 * Math.sin(accumulatedAngle * Math.PI / 180);
        
        accumulatedAngle += angle;
        
        const x2 = 100 + 90 * Math.cos(accumulatedAngle * Math.PI / 180);
        const y2 = 100 + 90 * Math.sin(accumulatedAngle * Math.PI / 180);
        
        const pathData = [
          `M 100 100`,
          `L ${x1} ${y1}`,
          `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `Z`
        ].join(' ');
        
        return <path key={key} d={pathData} fill={colors[i % colors.length]} />;
      })}
      <circle cx="100" cy="100" r="50" fill="#151821" />
      <text x="100" y="100" textAnchor="middle" dy=".3em" fill="#e8e9ec" fontSize="14">
        ${total.toFixed(2)}
      </text>
    </svg>
  );
};

// Main MoneyManagement component
export default function MoneyManagement() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringFrequency: 'none',
    source: ''
  });
  
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    targetDate: ''
  });
  
  const [reportForm, setReportForm] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const tabs = ['dashboard', 'income', 'expenses', 'budgets', 'goals', 'reports'];
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Common expense and income categories
  const expenseCategories = [
    'Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 
    'Healthcare', 'Education', 'Shopping', 'Other'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'
  ];
  
  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      
      try {
        switch (activeTab) {
          case 'dashboard':
            const dashboardRes = await api('/api/money/dashboard', { token });
            setDashboardData(dashboardRes);
            break;
            
          case 'income':
          case 'expenses':
            const type = activeTab === 'income' ? 'income' : 'expense';
            const transactionsRes = await api(`/api/money/transactions?type=${type}&limit=50`, { token });
            setTransactions(transactionsRes.transactions);
            break;
            
          case 'budgets':
            const budgetsRes = await api('/api/money/budgets', { token });
            setBudgets(budgetsRes);
            break;
            
          case 'goals':
            const goalsRes = await api('/api/money/savings-goals', { token });
            setSavingsGoals(goalsRes);
            break;
            
          case 'reports':
            const reportRes = await api(`/api/money/reports?startDate=${reportForm.startDate}&endDate=${reportForm.endDate}`, { token });
            setReportData(reportRes);
            break;
            
          default:
            break;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && token) {
      loadData();
    }
  }, [activeTab, user, token, reportForm.startDate, reportForm.endDate]);
  
  // Handle swipe for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left - go to next tab
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
    
    if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right - go to previous tab
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  };
  
  // Form handlers
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api('/api/money/transactions', {
        method: 'POST',
        body: transactionForm,
        token
      });
      
      setSuccess('Transaction added successfully');
      setTransactionForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        recurringFrequency: 'none',
        source: ''
      });
      
      // Reload data
      if (activeTab === 'dashboard') {
        const dashboardRes = await api('/api/money/dashboard', { token });
        setDashboardData(dashboardRes);
      } else {
        const type = activeTab === 'income' ? 'income' : 'expense';
        const transactionsRes = await api(`/api/money/transactions?type=${type}&limit=50`, { token });
        setTransactions(transactionsRes.transactions);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api('/api/money/budgets', {
        method: 'POST',
        body: budgetForm,
        token
      });
      
      setSuccess('Budget set successfully');
      setBudgetForm({
        category: '',
        amount: '',
        period: 'monthly'
      });
      
      // Reload budgets
      const budgetsRes = await api('/api/money/budgets', { token });
      setBudgets(budgetsRes);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api('/api/money/savings-goals', {
        method: 'POST',
        body: goalForm,
        token
      });
      
      setSuccess('Savings goal created successfully');
      setGoalForm({
        name: '',
        targetAmount: '',
        targetDate: ''
      });
      
      // Reload goals
      const goalsRes = await api('/api/money/savings-goals', { token });
      setSavingsGoals(goalsRes);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await api(`/api/money/transactions/${id}`, {
        method: 'DELETE',
        token
      });
      
      setSuccess('Transaction deleted successfully');
      
      // Reload data
      if (activeTab === 'dashboard') {
        const dashboardRes = await api('/api/money/dashboard', { token });
        setDashboardData(dashboardRes);
      } else {
        const type = activeTab === 'income' ? 'income' : 'expense';
        const transactionsRes = await api(`/api/money/transactions?type=${type}&limit=50`, { token });
        setTransactions(transactionsRes.transactions);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      await api(`/api/money/budgets/${id}`, {
        method: 'DELETE',
        token
      });
      
      setSuccess('Budget deleted successfully');
      
      // Reload budgets
      const budgetsRes = await api('/api/money/budgets', { token });
      setBudgets(budgetsRes);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this savings goal?')) return;
    
    try {
      await api(`/api/money/savings-goals/${id}`, {
        method: 'DELETE',
        token
      });
      
      setSuccess('Savings goal deleted successfully');
      
      // Reload goals
      const goalsRes = await api('/api/money/savings-goals', { token });
      setSavingsGoals(goalsRes);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleUpdateGoalProgress = async (id, amount) => {
    try {
      await api(`/api/money/savings-goals/${id}`, {
        method: 'PUT',
        body: { currentAmount: amount },
        token
      });
      
      setSuccess('Goal progress updated successfully');
      
      // Reload goals
      const goalsRes = await api('/api/money/savings-goals', { token });
      setSavingsGoals(goalsRes);
    } catch (err) {
      setError(err.message);
    }
  };
  
   if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in</h2>
          <p>You need to be logged in to access money management.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container money-management"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="card">
        <h2>Money Management</h2>
        
        {/* Tab Navigation */}
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Swipe Indicator for Mobile */}
        <div className="swipe-indicator">
          <span>Swipe left/right to navigate</span>
        </div>
        
        {/* Error/Success Messages */}
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        
        {/* Loading State */}
        {loading && <div className="loading">Loading...</div>}
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="tab-content">
            <h3>Financial Overview</h3>
            
            <div className="summary-cards">
              <div className="summary-card income">
                <h4>Income</h4>
                <p className="amount">${dashboardData.summary.income.toFixed(2)}</p>
              </div>
              
              <div className="summary-card expenses">
                <h4>Expenses</h4>
                <p className="amount">${dashboardData.summary.expenses.toFixed(2)}</p>
              </div>
              
              <div className={`summary-card savings ${dashboardData.summary.savings < 0 ? 'negative' : ''}`}>
                <h4>Savings</h4>
                <p className="amount">${dashboardData.summary.savings.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="charts">
              <div className="chart-container">
                <h4>Expenses by Category</h4>
                <BarChart data={dashboardData.expenseCategories} color="#ff6b6b" />
              </div>
              
              <div className="chart-container">
                <h4>Income by Category</h4>
                <BarChart data={dashboardData.incomeCategories} color="#6bff8d" />
              </div>
            </div>
            
            <div className="recent-transactions">
              <h4>Recent Transactions</h4>
              {dashboardData.transactions.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.transactions.map(t => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.description || 'No description'}</td>
                        <td>{t.category}</td>
                        <td className={t.type === 'income' ? 'text-income' : 'text-expense'}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No transactions yet.</p>
              )}
            </div>
          </div>
        )}
        
        {/* Income Tab */}
        {activeTab === 'income' && (
          <div className="tab-content">
            <h3>Income Management</h3>
            
            <div className="form-section">
              <h4>Add Income</h4>
              <form onSubmit={handleTransactionSubmit} className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      value={transactionForm.amount}
                      onChange={e => setTransactionForm({...transactionForm, amount: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Category</label>
                    <select
                      className="input"
                      value={transactionForm.category}
                      onChange={e => setTransactionForm({...transactionForm, category: e.target.value})}
                      required
                    >
                      <option value="">Select category</option>
                      {incomeCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Source</label>
                  <input
                    type="text"
                    className="input"
                    value={transactionForm.source}
                    onChange={e => setTransactionForm({...transactionForm, source: e.target.value})}
                    placeholder="Salary from Company XYZ"
                  />
                </div>
                
                <div className="form-group">
                  <label className="label">Description</label>
                  <input
                    type="text"
                    className="input"
                    value={transactionForm.description}
                    onChange={e => setTransactionForm({...transactionForm, description: e.target.value})}
                    placeholder="Optional description"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Date</label>
                    <input
                      type="date"
                      className="input"
                      value={transactionForm.date}
                      onChange={e => setTransactionForm({...transactionForm, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Recurring</label>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={transactionForm.isRecurring}
                        onChange={e => setTransactionForm({...transactionForm, isRecurring: e.target.checked})}
                      />
                      <span>This is a recurring income</span>
                    </div>
                    
                    {transactionForm.isRecurring && (
                      <select
                        className="input"
                        value={transactionForm.recurringFrequency}
                        onChange={e => setTransactionForm({...transactionForm, recurringFrequency: e.target.value})}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    )}
                  </div>
                </div>
                
                <button type="submit" className="btn">Add Income</button>
              </form>
            </div>
            
            <div className="list-section">
              <h4>Income History</h4>
              {transactions.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.source || 'N/A'}</td>
                        <td>{t.category}</td>
                        <td className="text-income">+${t.amount.toFixed(2)}</td>
                        <td>
                          <button 
                            className="btn danger small"
                            onClick={() => handleDeleteTransaction(t._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No income transactions yet.</p>
              )}
            </div>
          </div>
        )}
        
        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="tab-content">
            <h3>Expense Management</h3>
            
            <div className="form-section">
              <h4>Add Expense</h4>
              <form onSubmit={handleTransactionSubmit} className="form">
                <input type="hidden" value="expense" />
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      value={transactionForm.amount}
                      onChange={e => setTransactionForm({...transactionForm, amount: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Category</label>
                    <select
                      className="input"
                      value={transactionForm.category}
                      onChange={e => setTransactionForm({...transactionForm, category: e.target.value})}
                      required
                    >
                      <option value="">Select category</option>
                      {expenseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Payee/Description</label>
                  <input
                    type="text"
                    className="input"
                    value={transactionForm.description}
                    onChange={e => setTransactionForm({...transactionForm, description: e.target.value})}
                    placeholder="Where did you spend this money?"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Date</label>
                    <input
                      type="date"
                      className="input"
                      value={transactionForm.date}
                      onChange={e => setTransactionForm({...transactionForm, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Recurring</label>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={transactionForm.isRecurring}
                        onChange={e => setTransactionForm({...transactionForm, isRecurring: e.target.checked})}
                      />
                      <span>This is a recurring expense</span>
                    </div>
                    
                    {transactionForm.isRecurring && (
                      <select
                        className="input"
                        value={transactionForm.recurringFrequency}
                        onChange={e => setTransactionForm({...transactionForm, recurringFrequency: e.target.value})}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    )}
                  </div>
                </div>
                
                <button type="submit" className="btn">Add Expense</button>
              </form>
            </div>
            
            <div className="list-section">
              <h4>Expense History</h4>
              {transactions.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.description || 'N/A'}</td>
                        <td>{t.category}</td>
                        <td className="text-expense">-${t.amount.toFixed(2)}</td>
                        <td>
                          <button 
                            className="btn danger small"
                            onClick={() => handleDeleteTransaction(t._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No expense transactions yet.</p>
              )}
            </div>
          </div>
        )}
        
        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <div className="tab-content">
            <h3>Budget Management</h3>
            
            <div className="form-section">
              <h4>Create Budget</h4>
              <form onSubmit={handleBudgetSubmit} className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Category</label>
                    <select
                      className="input"
                      value={budgetForm.category}
                      onChange={e => setBudgetForm({...budgetForm, category: e.target.value})}
                      required
                    >
                      <option value="">Select category</option>
                      {expenseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      value={budgetForm.amount}
                      onChange={e => setBudgetForm({...budgetForm, amount: e.target.value})}
                      placeholder="Monthly budget amount"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Period</label>
                  <select
                    className="input"
                    value={budgetForm.period}
                    onChange={e => setBudgetForm({...budgetForm, period: e.target.value})}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                
                <button type="submit" className="btn">Set Budget</button>
              </form>
            </div>
            
            <div className="list-section">
              <h4>Your Budgets</h4>
              {budgets.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map(budget => (
                      <tr key={budget._id}>
                        <td>{budget.category}</td>
                        <td>${budget.amount.toFixed(2)}</td>
                        <td>{budget.period}</td>
                        <td>
                          <button 
                            className="btn danger small"
                            onClick={() => handleDeleteBudget(budget._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No budgets set yet.</p>
              )}
            </div>
          </div>
        )}
        
        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="tab-content">
            <h3>Savings Goals</h3>
            
            <div className="form-section">
              <h4>Create Savings Goal</h4>
              <form onSubmit={handleGoalSubmit} className="form">
                <div className="form-group">
                  <label className="label">Goal Name</label>
                  <input
                    type="text"
                    className="input"
                    value={goalForm.name}
                    onChange={e => setGoalForm({...goalForm, name: e.target.value})}
                    placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Target Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      value={goalForm.targetAmount}
                      onChange={e => setGoalForm({...goalForm, targetAmount: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">Target Date (optional)</label>
                    <input
                      type="date"
                      className="input"
                      value={goalForm.targetDate}
                      onChange={e => setGoalForm({...goalForm, targetDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn">Create Goal</button>
              </form>
            </div>
            
            <div className="list-section">
              <h4>Your Savings Goals</h4>
              {savingsGoals.length > 0 ? (
                <div className="goals-grid">
                  {savingsGoals.map(goal => (
                    <div key={goal._id} className="goal-card">
                      <h4>{goal.name}</h4>
                      <div className="goal-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                          ></div>
                        </div>
                        <div className="goal-amounts">
                          <span>${goal.currentAmount.toFixed(2)}</span>
                          <span>${goal.targetAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="goal-actions">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Add amount"
                          onBlur={(e) => {
                            if (e.target.value) {
                              const newAmount = parseFloat(e.target.value) + goal.currentAmount;
                              handleUpdateGoalProgress(goal._id, newAmount);
                              e.target.value = '';
                            }
                          }}
                          className="input small"
                        />
                        <button 
                          className="btn danger small"
                          onClick={() => handleDeleteGoal(goal._id)}
                        >
                          Delete
                        </button>
                      </div>
                      
                      {goal.targetDate && (
                        <div className="goal-date">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No savings goals yet.</p>
              )}
            </div>
          </div>
        )}
        
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-content">
            <h3>Financial Reports</h3>
            
            <div className="form-section">
              <h4>Generate Report</h4>
              <form className="form" onSubmit={(e) => {
                e.preventDefault();
                setActiveTab('reports');
              }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      className="input"
                      value={reportForm.startDate}
                      onChange={e => setReportForm({...reportForm, startDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      className="input"
                      value={reportForm.endDate}
                      onChange={e => setReportForm({...reportForm, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn">Generate Report</button>
              </form>
            </div>
            
            {reportData && (
              <div className="report-results">
                <h4>Report Results ({new Date(reportForm.startDate).toLocaleDateString()} - {new Date(reportForm.endDate).toLocaleDateString()})</h4>
                
                <div className="summary-cards">
                  <div className="summary-card income">
                    <h4>Total Income</h4>
                    <p className="amount">${reportData.summary.totalIncome.toFixed(2)}</p>
                  </div>
                  
                  <div className="summary-card expenses">
                    <h4>Total Expenses</h4>
                    <p className="amount">${reportData.summary.totalExpenses.toFixed(2)}</p>
                  </div>
                  
                  <div className={`summary-card savings ${reportData.summary.net < 0 ? 'negative' : ''}`}>
                    <h4>Net</h4>
                    <p className="amount">${reportData.summary.net.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="charts">
                  <div className="chart-container">
                    <h4>Income Breakdown</h4>
                    <PieChart data={reportData.incomeByCategory} />
                  </div>
                  
                  <div className="chart-container">
                    <h4>Expense Breakdown</h4>
                    <PieChart data={reportData.expensesByCategory} />
                  </div>
                </div>
                
                <div className="category-breakdown">
                  <div className="breakdown-section">
                    <h4>Income by Category</h4>
                    {Object.entries(reportData.incomeByCategory).length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(reportData.incomeByCategory)
                            .sort((a, b) => b[1] - a[1])
                            .map(([category, amount]) => (
                              <tr key={category}>
                                <td>{category}</td>
                                <td>${amount.toFixed(2)}</td>
                                <td>{((amount / reportData.summary.totalIncome) * 100).toFixed(1)}%</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    ) : (
                      <p>No income data for this period.</p>
                    )}
                  </div>
                  
                  <div className="breakdown-section">
                    <h4>Expenses by Category</h4>
                    {Object.entries(reportData.expensesByCategory).length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(reportData.expensesByCategory)
                            .sort((a, b) => b[1] - a[1])
                            .map(([category, amount]) => (
                              <tr key={category}>
                                <td>{category}</td>
                                <td>${amount.toFixed(2)}</td>
                                <td>{((amount / reportData.summary.totalExpenses) * 100).toFixed(1)}%</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    ) : (
                      <p>No expense data for this period.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}