import { useState } from "react";

export interface StoredTransaction {
  id: string;
  meta: {
    type: "transfer" | "swap";
    // For transfers
    amount?: number;
    token?: {
      symbol: string;
      logo: string;
      name: string;
      address: string;
    };
    recipient?: {
      name: string;
      address: string;
    };
    // For swaps
    fromToken?: {
      symbol: string;
      logo: string;
      name: string;
      address: string;
      amount: number;
      amountUSD: number;
    };
    toToken?: {
      symbol: string;
      logo: string;
      name: string;
      address: string;
      amount: number;
      amountUSD: number;
    };
  };
  callData: any;
  timestamp: number;
}

interface UseTransactionStorageReturn {
  transactions: StoredTransaction[];
  addTransaction: (
    transaction: Omit<StoredTransaction, "id" | "timestamp">,
  ) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;
}

const STORAGE_KEY = "pending_transactions";

// Helper functions to handle localStorage operations
const getStoredTransactions = (): StoredTransaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse stored transactions:", error);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const setStoredTransactions = (transactions: StoredTransaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const useTransactionStorage = (): UseTransactionStorageReturn => {
  // Initialize state with stored transactions
  const [transactions, setTransactions] = useState<StoredTransaction[]>(
    getStoredTransactions(),
  );

  const addTransaction = (
    transaction: Omit<StoredTransaction, "id" | "timestamp">,
  ) => {
    const newTransaction: StoredTransaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setTransactions((prevTransactions) => {
      const updatedTransactions = [...prevTransactions, newTransaction];
      setStoredTransactions(updatedTransactions);
      return updatedTransactions;
    });
  };

  const removeTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== id);
    setStoredTransactions(updatedTransactions);
    setTransactions(updatedTransactions);
  };

  const clearTransactions = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTransactions([]);
  };

  return {
    transactions,
    addTransaction,
    removeTransaction,
    clearTransactions,
  };
};
