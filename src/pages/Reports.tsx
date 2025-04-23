import { useState } from "react";
import { Bar, Line, Pie } from "recharts";
import { useExpenseStore, useCategoryStore } from "@/api/store";
import Layout from "@/components/layout/Layout";
import { formatCurrency } from "@/utils/formatters";
import { format, startOfMonth, endOfMonth, subMonths, isSameMonth } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("3months");
  const [chartType, setChartType] = useState("bar");
  
  const { getAll: getAllExpenses } = useExpenseStore();
  const { getAll: getAllCategories } = useCategoryStore();
  
  const expenses = getAllExpenses();
  const categories = getAllCategories();
  
  // Get current date and calculate date ranges
  const now = new Date();
  const currentMonth = startOfMonth(now);
  
  // Filter expenses based on selected timeframe
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    
    switch (timeframe) {
      case "1month":
        return isSameMonth(expenseDate, now);
      case "3months":
        return expenseDate >= subMonths(currentMonth, 2);
      case "6months":
        return expenseDate >= subMonths(currentMonth, 5);
      case "12months":
        return expenseDate >= subMonths(currentMonth, 11);
      default:
        return true;
    }
  });
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // Group expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Prepare data for charts
  const chartData = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || "Unknown",
      value: amount,
      color: category?.color?.replace("bg-", "") || "gray-500",
    };
  });
  
  // Sort chart data by value (highest first)
  chartData.sort((a, b) => b.value - a.value);
  
  // Group expenses by month (for trend analysis)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, i);
    return {
      month: format(date, "MMM"),
      date: startOfMonth(date),
    };
  }).reverse();
  
  const expensesByMonth = last6Months.map(({ month, date }) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthlyTotal = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: month,
      value: monthlyTotal,
    };
  });
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports & Analytics</h1>
        <p className="text-gray-600">Visualize your spending patterns</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chartData.length > 0 ? chartData[0].name : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {chartData.length > 0 ? formatCurrency(chartData[0].value) : "No data"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(expensesByCategory).length}</div>
            <p className="text-xs text-muted-foreground">
              With expenses in period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses / (timeframe === "1month" ? 1 : 
                timeframe === "3months" ? 3 : 
                timeframe === "6months" ? 6 : 12))}
            </div>
            <p className="text-xs text-muted-foreground">
              For selected period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Expense Trend</CardTitle>
            <CardDescription>Your spending over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {expensesByMonth.length > 0 ? (
              <div className="h-full w-full">
                {/* Placeholder for chart - would use a real chart library */}
                <div className="h-full w-full flex items-end justify-between">
                  {expensesByMonth.map((month, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="bg-primary w-12 rounded-t-md" 
                        style={{ 
                          height: `${Math.max(
                            5, 
                            (month.value / Math.max(...expensesByMonth.map(m => m.value))) * 200
                          )}px` 
                        }}
                      ></div>
                      <span className="text-xs mt-2">{month.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(month.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              <div className="flex items-center justify-between mt-2">
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="12months">12 Months</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">Pie</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData.length > 0 ? (
              <div className="h-full w-full">
                {chartType === "pie" ? (
                  <div className="h-full w-full flex items-center justify-center">
                    {/* Placeholder for pie chart */}
                    <div className="relative h-40 w-40 rounded-full bg-gray-100">
                      {chartData.map((item, index, arr) => {
                        const total = arr.reduce((sum, i) => sum + i.value, 0);
                        const percentage = (item.value / total) * 100;
                        return (
                          <div 
                            key={index}
                            className={`absolute inset-0 bg-${item.color}`}
                            style={{
                              clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos(index * 2 * Math.PI / arr.length)}% ${50 - 50 * Math.sin(index * 2 * Math.PI / arr.length)}%, ${50 + 50 * Math.cos((index + 1) * 2 * Math.PI / arr.length)}% ${50 - 50 * Math.sin((index + 1) * 2 * Math.PI / arr.length)}%)`
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col justify-end">
                    {/* Placeholder for bar chart */}
                    <div className="h-full flex items-end space-x-2">
                      {chartData.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full bg-${item.color} rounded-t-sm`} 
                            style={{ 
                              height: `${Math.max(
                                10, 
                                (item.value / Math.max(...chartData.map(d => d.value))) * 200
                              )}px` 
                            }}
                          ></div>
                          <span className="text-xs mt-2 truncate w-full text-center">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Detailed view of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.length > 0 ? (
              chartData.map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${item.color} mr-2`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                      <div 
                        className={`h-full bg-${item.color} rounded-full`}
                        style={{ 
                          width: `${(item.value / totalExpenses) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{((item.value / totalExpenses) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
