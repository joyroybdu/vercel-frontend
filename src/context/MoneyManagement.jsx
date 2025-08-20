// context/MoneyManagementContext.jsx
import { createContext, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api  from '../services/api';

const MoneyManagementContext = createContext();

export function MoneyManagementProvider({ children }) {
  const { token } = useAuth();

  const fetchTransactions = useCallback(async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/transactions${queryString ? `?${queryString}` : ''}`;
    const data = await api(url, { token });
    return data;
  }, [token]);

  const fetchTransaction = useCallback(async (id) => {
    const data = await api(`/api/transactions/${id}`, { token });
    return data;
  }, [token]);

  const addTransaction = useCallback(async (transactionData) => {
    const transaction = await api('/api/transactions', {
      method: 'POST',
      body: transactionData,
      token
    });
    return transaction;
  }, [token]);

  const updateTransaction = useCallback(async (id, transactionData) => {
    const transaction = await api(`/api/transactions/${id}`, {
      method: 'PUT',
      body: transactionData,
      token
    });
    return transaction;
  }, [token]);

  const deleteTransaction = useCallback(async (id) => {
    await api(`/api/transactions/${id}`, {
      method: 'DELETE',
      token
    });
  }, [token]);

  const fetchCategories = useCallback(async () => {
    const data = await api('/api/categories', { token });
    return data;
  }, [token]);

  const fetchBudget = useCallback(async (period = 'monthly') => {
    const data = await api(`/api/budget?period=${period}`, { token });
    return data;
  }, [token]);

  const updateBudget = useCallback(async (budgetData) => {
    const budget = await api('/api/budget', {
      method: 'PUT',
      body: budgetData,
      token
    });
    return budget;
  }, [token]);

  const fetchReports = useCallback(async (reportType, params = {}) => {
    const queryString = new URLSearchParams({ type: reportType, ...params }).toString();
    const data = await api(`/api/reports?${queryString}`, { token });
    return data;
  }, [token]);

  const value = {
    fetchTransactions,
    fetchTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchCategories,
    fetchBudget,
    updateBudget,
    fetchReports
  };

  return (
    <MoneyManagementContext.Provider value={value}>
      {children}
    </MoneyManagementContext.Provider>
  );
}

export const useMoneyManagement = () => useContext(MoneyManagementContext);