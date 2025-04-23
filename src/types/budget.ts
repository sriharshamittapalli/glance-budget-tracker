
export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Expense = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
};

export type MonthlySpending = {
  month: string;
  amount: number;
};

export type CategorySpending = {
  categoryId: string;
  amount: number;
  percentage: number;
};
