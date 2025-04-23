
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categorySpendingData, getCategoryById } from "@/data/sampleData";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

export function SpendingByCategory() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6">
          {categorySpendingData.slice(0, 5).map((item) => {
            const category = getCategoryById(item.categoryId);
            return (
              <div
                key={item.categoryId}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full bg-${category?.color} mr-3`}
                  ></div>
                  <span className="text-sm font-medium">{category?.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatCurrency(item.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPercentage(item.percentage)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
