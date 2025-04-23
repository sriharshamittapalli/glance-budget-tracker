
import { useState, useEffect, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Expense, ExpenseCategory } from "@/types/budget";
import { useExpenseStore, useCategoryStore } from "@/api/store";
import { formatCurrency } from "@/utils/formatters";
import Layout from "@/components/layout/Layout";
import ExpenseForm from "@/components/expenses/ExpenseForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [selectedDateExpenses, setSelectedDateExpenses] = useState<Expense[]>([]);
  const [isExpenseDetailOpen, setIsExpenseDetailOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  const { getAll: getAllExpenses, update: updateExpense, remove: deleteExpense } = useExpenseStore();
  const { getAll: getAllCategories } = useCategoryStore();
  
  // Load initial data with useEffect to improve performance
  useEffect(() => {
    loadExpenses();
    setCategories(getAllCategories());
  }, []);
  
  // Optimize by using a callback
  const loadExpenses = () => {
    const allExpenses = getAllExpenses();
    setExpenses(allExpenses);
  };
  
  // Use useMemo to optimize selected date expenses calculation
  useEffect(() => {
    if (date) {
      const dayExpenses = expenses.filter(expense => 
        isSameDay(new Date(expense.date), date)
      );
      setSelectedDateExpenses(dayExpenses);
    }
  }, [date, expenses]);
  
  // Use useMemo for performance optimization
  const categoriesMap = useMemo(() => {
    const map: Record<string, ExpenseCategory> = {};
    categories.forEach(cat => {
      map[cat.id] = cat;
    });
    return map;
  }, [categories]);
  
  // Optimize category lookup
  const getCategoryById = (categoryId: string) => {
    return categoriesMap[categoryId];
  };
  
  // Check if a date has expenses - optimized
  const hasExpenseOnDate = (day: Date) => {
    return expenses.some(expense => isSameDay(new Date(expense.date), day));
  };
  
  // Handle viewing expense details
  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsExpenseDetailOpen(true);
  };
  
  // Handle editing expense
  const handleEditExpense = () => {
    setIsExpenseDetailOpen(false);
    setIsEditExpenseOpen(true);
  };
  
  // Handle saving edited expense
  const handleSaveEditedExpense = (data: any) => {
    if (selectedExpense) {
      updateExpense({
        id: selectedExpense.id,
        description: data.description,
        amount: data.amount,
        date: data.date.toISOString(),
        categoryId: data.categoryId,
      });
      setSelectedExpense(null);
      loadExpenses();
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated",
      });
    }
  };
  
  // Handle deleting expense
  const handleDeleteExpense = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setIsExpenseDetailOpen(false);
      setSelectedExpense(null);
      loadExpenses();
      toast({
        title: "Expense deleted",
        description: "Your expense has been successfully deleted",
      });
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Calendar</h1>
        <p className="text-gray-600">View your financial calendar</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-5">
          <Card>
            <CardContent className="p-6">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="w-full pointer-events-auto"
                modifiers={{
                  hasExpense: (day) => hasExpenseOnDate(day),
                }}
                modifiersClassNames={{
                  hasExpense: "bg-budget-purple-100 font-bold",
                }}
                footer={
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Dates with expenses are highlighted
                  </p>
                }
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{format(date, "MMMM d, yyyy")}</CardTitle>
              <CardDescription>
                {selectedDateExpenses.length > 0
                  ? `${selectedDateExpenses.length} expense${selectedDateExpenses.length > 1 ? "s" : ""} for this day`
                  : "No expenses for this day"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDateExpenses.length > 0 ? (
                selectedDateExpenses.map(expense => {
                  const category = getCategoryById(expense.categoryId);
                  
                  return (
                    <div
                      key={expense.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewExpense(expense)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{expense.description}</span>
                        <span className="text-right">{formatCurrency(expense.amount)}</span>
                      </div>
                      {category && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${category.color}`}
                          />
                          <span>{category.name}</span>
                        </Badge>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No expenses for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Expense Detail Dialog */}
      {selectedExpense && (
        <Dialog open={isExpenseDetailOpen} onOpenChange={setIsExpenseDetailOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span>{selectedExpense.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className="font-bold">{formatCurrency(selectedExpense.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{format(new Date(selectedExpense.date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>
                  {getCategoryById(selectedExpense.categoryId)?.name || "Unknown"}
                </span>
              </div>
            </div>
            <DialogFooter className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsExpenseDetailOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteExpense}
              >
                Delete
              </Button>
              <Button
                onClick={handleEditExpense}
              >
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Expense Form */}
      {selectedExpense && (
        <ExpenseForm
          open={isEditExpenseOpen}
          onClose={() => {
            setIsEditExpenseOpen(false);
            setSelectedExpense(null);
          }}
          onSubmit={handleSaveEditedExpense}
          defaultValues={{
            description: selectedExpense.description,
            amount: selectedExpense.amount,
            date: new Date(selectedExpense.date),
            categoryId: selectedExpense.categoryId,
          }}
          title="Edit Expense"
        />
      )}
    </Layout>
  );
}
