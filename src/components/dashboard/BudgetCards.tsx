
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { budgets, categories, getExpensesByCategoryId } from "@/data/sampleData";
import { formatCurrency } from "@/utils/formatters";

export function BudgetCards() {
  // Get top budget categories (limit to 4 for dashboard)
  const topBudgets = budgets.slice(0, 4);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {topBudgets.map((budget) => {
        const category = categories.find((c) => c.id === budget.categoryId);
        const expenses = getExpensesByCategoryId(budget.categoryId);
        const spentAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const percentage = Math.min(100, (spentAmount / budget.amount) * 100);
        
        let ringColor = "stroke-budget-green-500";
        if (percentage > 90) {
          ringColor = "stroke-budget-red-500";
        } else if (percentage > 75) {
          ringColor = "stroke-budget-yellow-500";
        }
        
        return (
          <Card key={budget.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <ProgressRing
                  value={percentage}
                  size={80}
                  strokeWidth={8}
                  background="stroke-gray-100"
                  foreground={ringColor}
                  label={
                    <div className="text-center">
                      <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                    </div>
                  }
                />
                <h3 className="mt-3 font-medium text-center">{category?.name}</h3>
                <div className="mt-1 text-xs text-center text-muted-foreground">
                  <span>{formatCurrency(spentAmount)}</span>
                  <span className="mx-1">/</span>
                  <span>{formatCurrency(budget.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
