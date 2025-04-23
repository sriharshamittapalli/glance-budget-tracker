
import { Expense, Budget, ExpenseCategory } from "@/types/budget";
import { useToast } from "@/hooks/use-toast";

// Default categories
export const defaultCategories: ExpenseCategory[] = [
  { 
    id: "cat_housing", 
    name: "Housing", 
    color: "bg-budget-purple-500",
    icon: "home" 
  },
  { 
    id: "cat_food", 
    name: "Food & Dining", 
    color: "bg-budget-green-500",
    icon: "utensils" 
  },
  { 
    id: "cat_transportation", 
    name: "Transportation", 
    color: "bg-budget-blue-500",
    icon: "car" 
  },
  { 
    id: "cat_entertainment", 
    name: "Entertainment", 
    color: "bg-budget-yellow-500",
    icon: "film" 
  },
  { 
    id: "cat_healthcare", 
    name: "Healthcare", 
    color: "bg-budget-red-500",
    icon: "heart" 
  },
  { 
    id: "cat_shopping", 
    name: "Shopping", 
    color: "bg-budget-purple-400",
    icon: "shopping-bag" 
  },
  { 
    id: "cat_utilities", 
    name: "Utilities", 
    color: "bg-budget-blue-700",
    icon: "zap" 
  },
  { 
    id: "cat_other", 
    name: "Other", 
    color: "bg-gray-500",
    icon: "more-horizontal" 
  },
];

// Initialize storage with default data if not exists
const initializeStorage = () => {
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('budgets')) {
    localStorage.setItem('budgets', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }
};

// Make sure storage is initialized
initializeStorage();

// Helper functions for CRUD operations
export const getExpenses = (): Expense[] => {
  const expenses = localStorage.getItem('expenses');
  return expenses ? JSON.parse(expenses) : [];
};

export const addExpense = (expense: Omit<Expense, "id">): Expense => {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: `exp_${Date.now()}`
  };
  expenses.push(newExpense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  return newExpense;
};

export const updateExpense = (expense: Expense): Expense => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === expense.id);
  
  if (index !== -1) {
    expenses[index] = expense;
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return expense;
  }
  
  throw new Error(`Expense with id ${expense.id} not found`);
};

export const deleteExpense = (id: string): void => {
  const expenses = getExpenses();
  const updatedExpenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
};

export const getBudgets = (): Budget[] => {
  const budgets = localStorage.getItem('budgets');
  return budgets ? JSON.parse(budgets) : [];
};

export const addBudget = (budget: Omit<Budget, "id">): Budget => {
  const budgets = getBudgets();
  const newBudget = {
    ...budget,
    id: `bud_${Date.now()}`
  };
  budgets.push(newBudget);
  localStorage.setItem('budgets', JSON.stringify(budgets));
  return newBudget;
};

export const updateBudget = (budget: Budget): Budget => {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b.id === budget.id);
  
  if (index !== -1) {
    budgets[index] = budget;
    localStorage.setItem('budgets', JSON.stringify(budgets));
    return budget;
  }
  
  throw new Error(`Budget with id ${budget.id} not found`);
};

export const deleteBudget = (id: string): void => {
  const budgets = getBudgets();
  const updatedBudgets = budgets.filter(budget => budget.id !== id);
  localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
};

export const getCategories = (): ExpenseCategory[] => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : defaultCategories;
};

export const addCategory = (category: Omit<ExpenseCategory, "id">): ExpenseCategory => {
  const categories = getCategories();
  const newCategory = {
    ...category,
    id: `cat_${Date.now()}`
  };
  categories.push(newCategory);
  localStorage.setItem('categories', JSON.stringify(categories));
  return newCategory;
};

export const updateCategory = (category: ExpenseCategory): ExpenseCategory => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === category.id);
  
  if (index !== -1) {
    categories[index] = category;
    localStorage.setItem('categories', JSON.stringify(categories));
    return category;
  }
  
  throw new Error(`Category with id ${category.id} not found`);
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const updatedCategories = categories.filter(category => category.id !== id);
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
};

// Custom hooks for data management
export const useExpenseStore = () => {
  const { toast } = useToast();
  
  const getAll = (): Expense[] => getExpenses();
  
  const add = (expense: Omit<Expense, "id">): Expense => {
    try {
      const newExpense = addExpense(expense);
      toast({
        title: "Expense Added",
        description: "Your expense has been added successfully."
      });
      return newExpense;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const update = (expense: Expense): Expense => {
    try {
      const updatedExpense = updateExpense(expense);
      toast({
        title: "Expense Updated",
        description: "Your expense has been updated successfully."
      });
      return updatedExpense;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const remove = (id: string): void => {
    try {
      deleteExpense(id);
      toast({
        title: "Expense Deleted",
        description: "Your expense has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    getAll,
    add,
    update,
    remove,
  };
};

export const useBudgetStore = () => {
  const { toast } = useToast();
  
  const getAll = (): Budget[] => getBudgets();
  
  const add = (budget: Omit<Budget, "id">): Budget => {
    try {
      const newBudget = addBudget(budget);
      toast({
        title: "Budget Added",
        description: "Your budget has been added successfully."
      });
      return newBudget;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add budget. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const update = (budget: Budget): Budget => {
    try {
      const updatedBudget = updateBudget(budget);
      toast({
        title: "Budget Updated",
        description: "Your budget has been updated successfully."
      });
      return updatedBudget;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const remove = (id: string): void => {
    try {
      deleteBudget(id);
      toast({
        title: "Budget Deleted",
        description: "Your budget has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    getAll,
    add,
    update,
    remove,
  };
};

export const useCategoryStore = () => {
  const { toast } = useToast();
  
  const getAll = (): ExpenseCategory[] => getCategories();
  
  const add = (category: Omit<ExpenseCategory, "id">): ExpenseCategory => {
    try {
      const newCategory = addCategory(category);
      toast({
        title: "Category Added",
        description: "Your category has been added successfully."
      });
      return newCategory;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const update = (category: ExpenseCategory): ExpenseCategory => {
    try {
      const updatedCategory = updateCategory(category);
      toast({
        title: "Category Updated",
        description: "Your category has been updated successfully."
      });
      return updatedCategory;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const remove = (id: string): void => {
    try {
      deleteCategory(id);
      toast({
        title: "Category Deleted",
        description: "Your category has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    getAll,
    add,
    update,
    remove,
  };
};
