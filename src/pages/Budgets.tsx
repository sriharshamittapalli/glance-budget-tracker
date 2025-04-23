
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import BudgetForm from "@/components/budgets/BudgetForm";
import { Budget, Expense, ExpenseCategory } from "@/types/budget";
import { useBudgetStore, useCategoryStore, useExpenseStore } from "@/api/store";
import { formatCurrency } from "@/utils/formatters";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  const { getAll: getAllBudgets, add: addBudget, update: updateBudget, remove: deleteBudget } = useBudgetStore();
  const { getAll: getAllExpenses } = useExpenseStore();
  const { getAll: getAllCategories } = useCategoryStore();
  
  // Load initial data
  useEffect(() => {
    loadBudgets();
    setExpenses(getAllExpenses());
    setCategories(getAllCategories());
  }, []);
  
  // Reload budgets when changes are made
  const loadBudgets = () => {
    setBudgets(getAllBudgets());
  };
  
  // Find category by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(category => category.id === categoryId);
  };
  
  // Calculate spending for a category
  const calculateSpendingForCategory = (categoryId: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expense.categoryId === categoryId &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  // Handle adding a new budget
  const handleAddBudget = (data: any) => {
    addBudget({
      amount: data.amount,
      categoryId: data.categoryId,
      period: data.period,
    });
    loadBudgets();
  };
  
  // Handle editing a budget
  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsAddBudgetOpen(true);
  };
  
  // Handle saving edited budget
  const handleSaveEditedBudget = (data: any) => {
    if (selectedBudget) {
      updateBudget({
        id: selectedBudget.id,
        amount: data.amount,
        categoryId: data.categoryId,
        period: data.period,
      });
      setSelectedBudget(null);
      loadBudgets();
    }
  };
  
  // Handle confirming deletion
  const handleConfirmDelete = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsConfirmDeleteOpen(true);
  };
  
  // Handle actual deletion
  const handleDeleteBudget = () => {
    if (selectedBudget) {
      deleteBudget(selectedBudget.id);
      setIsConfirmDeleteOpen(false);
      setSelectedBudget(null);
      loadBudgets();
    }
  };
  
  // Format period for display
  const formatPeriod = (period: 'weekly' | 'monthly' | 'yearly') => {
    switch (period) {
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return period;
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Budgets</h1>
        <p className="text-gray-600">Set and manage your budget goals</p>
      </div>
      
      {/* Add Budget Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsAddBudgetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>
      
      {/* Budget Cards Grid */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const category = getCategoryById(budget.categoryId);
            const spending = calculateSpendingForCategory(budget.categoryId);
            const progress = Math.min(100, (spending / budget.amount) * 100);
            const isOverBudget = spending > budget.amount;
            
            return (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {formatPeriod(budget.period)}
                      </Badge>
                      <CardTitle className="text-lg">
                        {category?.name || "Unknown Category"}
                      </CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditBudget(budget)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleConfirmDelete(budget)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span className={isOverBudget ? "text-red-500" : ""}>
                        {formatCurrency(spending)} of {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      indicatorClassName={isOverBudget ? "bg-budget-red-500" : undefined}
                    />
                    {isOverBudget && (
                      <p className="text-red-500 text-xs mt-1">
                        Over budget by {formatCurrency(spending - budget.amount)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No budgets set</h3>
          <p className="text-gray-500 mb-4">
            Start setting budget limits for your spending categories.
          </p>
          <Button onClick={() => setIsAddBudgetOpen(true)}>
            Create Your First Budget
          </Button>
        </div>
      )}
      
      {/* Add/Edit Budget Dialog */}
      <BudgetForm
        open={isAddBudgetOpen}
        onClose={() => {
          setIsAddBudgetOpen(false);
          setSelectedBudget(null);
        }}
        onSubmit={selectedBudget ? handleSaveEditedBudget : handleAddBudget}
        defaultValues={
          selectedBudget
            ? {
                amount: selectedBudget.amount,
                categoryId: selectedBudget.categoryId,
                period: selectedBudget.period,
              }
            : undefined
        }
        title={selectedBudget ? "Edit Budget" : "Add Budget"}
      />
      
      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBudget}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
