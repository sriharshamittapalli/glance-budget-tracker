
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { getTotalBudget, getTotalSpending } from "@/data/sampleData";

export function BudgetSummaryCard() {
  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpending();
  const remainingBudget = totalBudget - totalSpent;
  const percentUsed = (totalSpent / totalBudget) * 100;

  const getStatusColor = () => {
    if (percentUsed > 90) return "text-budget-red-500";
    if (percentUsed > 75) return "text-budget-yellow-500";
    return "text-budget-green-500";
  };

  const getProgressColor = () => {
    if (percentUsed > 90) return "bg-budget-red-500";
    if (percentUsed > 75) return "bg-budget-yellow-500";
    return "bg-budget-green-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {formatCurrency(remainingBudget)}
          </span>
        </div>
        <Progress
          value={percentUsed}
          className="h-2 mb-2"
          indicatorClassName={getProgressColor()}
        />
        <div className="flex justify-between text-sm">
          <span>
            <span className="text-muted-foreground">Spent: </span>
            <span className="font-medium">{formatCurrency(totalSpent)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Budget: </span>
            <span className="font-medium">{formatCurrency(totalBudget)}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
