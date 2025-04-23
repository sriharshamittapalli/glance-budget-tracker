
import { Budget, Expense, ExpenseCategory, MonthlySpending, CategorySpending } from '../types/budget';

export const categories: ExpenseCategory[] = [
  { id: '1', name: 'Housing', color: 'budget-purple-400', icon: 'home' },
  { id: '2', name: 'Food', color: 'budget-green-500', icon: 'utensils' },
  { id: '3', name: 'Transportation', color: 'budget-yellow-500', icon: 'car' },
  { id: '4', name: 'Entertainment', color: 'budget-red-500', icon: 'film' },
  { id: '5', name: 'Shopping', color: 'budget-blue-500', icon: 'shopping-bag' },
  { id: '6', name: 'Utilities', color: 'budget-purple-600', icon: 'zap' },
  { id: '7', name: 'Health', color: 'budget-green-700', icon: 'activity' },
  { id: '8', name: 'Personal', color: 'budget-yellow-700', icon: 'user' }
];

export const expenses: Expense[] = [
  { id: '1', amount: 1200, description: 'Rent', date: '2025-04-01', categoryId: '1' },
  { id: '2', amount: 85, description: 'Grocery shopping', date: '2025-04-05', categoryId: '2' },
  { id: '3', amount: 45, description: 'Gas', date: '2025-04-08', categoryId: '3' },
  { id: '4', amount: 35, description: 'Movie tickets', date: '2025-04-10', categoryId: '4' },
  { id: '5', amount: 120, description: 'New clothes', date: '2025-04-12', categoryId: '5' },
  { id: '6', amount: 95, description: 'Electric bill', date: '2025-04-15', categoryId: '6' },
  { id: '7', amount: 60, description: 'Medicine', date: '2025-04-18', categoryId: '7' },
  { id: '8', amount: 25, description: 'Haircut', date: '2025-04-20', categoryId: '8' },
  { id: '9', amount: 75, description: 'Dinner out', date: '2025-04-22', categoryId: '2' },
  { id: '10', amount: 40, description: 'Uber rides', date: '2025-04-23', categoryId: '3' }
];

export const budgets: Budget[] = [
  { id: '1', categoryId: '1', amount: 1300, period: 'monthly' },
  { id: '2', categoryId: '2', amount: 400, period: 'monthly' },
  { id: '3', categoryId: '3', amount: 200, period: 'monthly' },
  { id: '4', categoryId: '4', amount: 150, period: 'monthly' },
  { id: '5', categoryId: '5', amount: 200, period: 'monthly' },
  { id: '6', categoryId: '6', amount: 150, period: 'monthly' },
  { id: '7', categoryId: '7', amount: 100, period: 'monthly' },
  { id: '8', categoryId: '8', amount: 100, period: 'monthly' }
];

export const monthlySpendingData: MonthlySpending[] = [
  { month: 'Jan', amount: 2100 },
  { month: 'Feb', amount: 2200 },
  { month: 'Mar', amount: 2050 },
  { month: 'Apr', amount: 1780 },
  { month: 'May', amount: 0 },
  { month: 'Jun', amount: 0 },
  { month: 'Jul', amount: 0 },
  { month: 'Aug', amount: 0 },
  { month: 'Sep', amount: 0 },
  { month: 'Oct', amount: 0 },
  { month: 'Nov', amount: 0 },
  { month: 'Dec', amount: 0 }
];

export const categorySpendingData: CategorySpending[] = [
  { categoryId: '1', amount: 1200, percentage: 67.4 },
  { categoryId: '2', amount: 160, percentage: 9.0 },
  { categoryId: '3', amount: 85, percentage: 4.8 },
  { categoryId: '4', amount: 35, percentage: 2.0 },
  { categoryId: '5', amount: 120, percentage: 6.7 },
  { categoryId: '6', amount: 95, percentage: 5.3 },
  { categoryId: '7', amount: 60, percentage: 3.4 },
  { categoryId: '8', amount: 25, percentage: 1.4 }
];

export const getTotalSpending = (): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getTotalBudget = (): number => {
  return budgets.reduce((total, budget) => total + budget.amount, 0);
};

export const getCategoryById = (id: string): ExpenseCategory | undefined => {
  return categories.find(category => category.id === id);
};

export const getExpensesByCategoryId = (categoryId: string): Expense[] => {
  return expenses.filter(expense => expense.categoryId === categoryId);
};

export const getBudgetByCategoryId = (categoryId: string): Budget | undefined => {
  return budgets.find(budget => budget.categoryId === categoryId);
};
