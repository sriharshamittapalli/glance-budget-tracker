
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Expense, ExpenseCategory, CategorySpending, MonthlySpending } from "@/types/budget";
import { useExpenseStore, useCategoryStore } from "@/api/store";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ReportsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { getAll: getAllExpenses } = useExpenseStore();
  const { getAll: getAllCategories } = useCategoryStore();
  
  // Load initial data and calculate reports
  useEffect(() => {
    const expensesData = getAllExpenses();
    const categoriesData = getAllCategories();
    
    setExpenses(expensesData);
    setCategories(categoriesData);
    
    // Filter expenses for selected year
    const yearExpenses = expensesData.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === selectedYear;
    });
    
    // Calculate total spending
    const total = yearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalSpending(total);
    
    // Calculate category spending
    const catSpending: { [key: string]: number } = {};
    yearExpenses.forEach(expense => {
      if (!catSpending[expense.categoryId]) {
        catSpending[expense.categoryId] = 0;
      }
      catSpending[expense.categoryId] += expense.amount;
    });
    
    const categoryData = Object.entries(catSpending).map(([categoryId, amount]) => ({
      categoryId,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
    
    setCategorySpending(categoryData);
    
    // Calculate monthly spending
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const monthlyData = months.map((month, index) => {
      const amount = yearExpenses
        .filter(expense => new Date(expense.date).getMonth() === index)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        month,
        amount
      };
    });
    
    setMonthlySpending(monthlyData);
  }, [selectedYear]);
  
  // Find category by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(category => category.id === categoryId);
  };
  
  // Generate chart config object for category colors
  const chartConfig = categories.reduce((config, category) => {
    config[category.id] = { 
      label: category.name,
      color: category.color.replace('bg-', '')
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);
  
  // Format category spending data for pie chart
  const pieChartData = categorySpending.map(item => {
    const category = getCategoryById(item.categoryId);
    return {
      name: category?.name || "Unknown",
      value: item.amount,
      categoryId: item.categoryId,
    };
  });
  
  // Get available years for selection
  const availableYears = [...new Set(expenses.map(expense => 
    new Date(expense.date).getFullYear()
  ))].sort((a, b) => b - a); // Sort descending (most recent first)
  
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
        <p className="text-gray-600">View detailed financial reports</p>
      </div>
      
      {/* Year selector */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded p-2"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Spending in {selectedYear}</CardTitle>
                <CardDescription>Summary of your spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalSpending)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Spending Distribution</CardTitle>
                <CardDescription>by category</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {pieChartData.length > 0 ? (
                  <ChartContainer 
                    config={chartConfig}
                    className="h-full"
                  >
                    <PieChart width={300} height={240}>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => {
                          const category = getCategoryById(entry.categoryId);
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={category?.color ? 
                                category.color.replace('bg-', '').startsWith('#') ? 
                                  category.color.replace('bg-', '') : 
                                  `var(--${category.color.replace('bg-', '')})` : 
                                '#ccc'
                              } 
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <ChartLegend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No spending data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>Spending over the months</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlySpending}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--budget-purple-500)" 
                    fill="var(--budget-purple-200)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              {categorySpending.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySpending
                      .sort((a, b) => b.amount - a.amount)
                      .map((item) => {
                        const category = getCategoryById(item.categoryId);
                        
                        return (
                          <TableRow key={item.categoryId}>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${category?.color}`} />
                                <span>{category?.name || "Unknown"}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                            <TableCell>{formatPercentage(item.percentage)}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No spending data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>Spending by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlySpending}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar
                      dataKey="amount"
                      fill="var(--budget-purple-500)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Table className="mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlySpending.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell>{item.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
