import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { Expense, ExpenseCategory } from "@/types/budget";
import { useExpenseStore, useCategoryStore } from "@/api/store";
import { formatCurrency, formatDate } from "@/utils/formatters";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { getAll: getAllExpenses, add: addExpense, update: updateExpense, remove: deleteExpense } = useExpenseStore();
  const { getAll: getAllCategories } = useCategoryStore();
  
  useEffect(() => {
    loadExpenses();
    setCategories(getAllCategories());
  }, []);
  
  const loadExpenses = () => {
    setExpenses(getAllExpenses());
  };
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" ? true : expense.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const getCategoryById = (categoryId: string) => {
    return categories.find(category => category.id === categoryId);
  };
  
  const handleAddExpense = (data: any) => {
    addExpense({
      description: data.description,
      amount: data.amount,
      date: data.date.toISOString(),
      categoryId: data.categoryId,
    });
    loadExpenses();
  };
  
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsAddExpenseOpen(true);
  };
  
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
    }
  };
  
  const handleConfirmDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleDeleteExpense = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setIsConfirmDeleteOpen(false);
      setSelectedExpense(null);
      loadExpenses();
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Expenses</h1>
        <p className="text-gray-600">Track and manage your expenses</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={categoryFilter !== "" ? categoryFilter : "all"} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-1/4">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${category.color}`} />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button className="w-full md:w-auto" onClick={() => setIsAddExpenseOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {sortedExpenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => {
                const category = getCategoryById(expense.categoryId);
                
                return (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      {category && (
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${category.color}`} />
                          <span>{category.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleConfirmDelete(expense)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {expenses.length === 0 ? (
              <div>
                <p className="mb-4">You haven't added any expenses yet.</p>
                <Button onClick={() => setIsAddExpenseOpen(true)}>Add Your First Expense</Button>
              </div>
            ) : (
              <p>No expenses match your search criteria.</p>
            )}
          </div>
        )}
      </div>
      
      <ExpenseForm
        open={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={selectedExpense ? handleSaveEditedExpense : handleAddExpense}
        defaultValues={
          selectedExpense
            ? {
                description: selectedExpense.description,
                amount: selectedExpense.amount,
                date: new Date(selectedExpense.date),
                categoryId: selectedExpense.categoryId,
              }
            : undefined
        }
        title={selectedExpense ? "Edit Expense" : "Add Expense"}
      />
      
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
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
              onClick={handleDeleteExpense}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
