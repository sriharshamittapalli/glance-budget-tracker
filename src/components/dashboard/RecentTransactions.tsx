
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { expenses, getCategoryById } from "@/data/sampleData";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function RecentTransactions() {
  const [limit, setLimit] = useState(5);
  
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const visibleExpenses = sortedExpenses.slice(0, limit);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          {visibleExpenses.map((expense) => {
            const category = getCategoryById(expense.categoryId);
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 px-6 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{expense.description}</p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`w-2 h-2 rounded-full bg-${category?.color} mr-2`}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {category?.name}
                    </span>
                    <span className="mx-2 text-muted-foreground text-xs">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
                <span className="font-medium">{formatCurrency(expense.amount)}</span>
              </div>
            );
          })}
        </div>
        {limit < expenses.length && (
          <div className="px-6 py-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLimit(limit + 5)}
              className="text-budget-purple-500 hover:text-budget-purple-700 hover:bg-budget-purple-100"
            >
              View More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
