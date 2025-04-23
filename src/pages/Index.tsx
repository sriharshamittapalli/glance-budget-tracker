
import Layout from "@/components/layout/Layout";
import { BudgetSummaryCard } from "@/components/dashboard/BudgetSummaryCard";
import { BudgetCards } from "@/components/dashboard/BudgetCards";
import { SpendingByCategory } from "@/components/dashboard/SpendingByCategory";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingTrendChart } from "@/components/dashboard/SpendingTrendChart";
import { formatCurrency } from "@/utils/formatters";
import { getTotalSpending } from "@/data/sampleData";
import { getCurrentMonth } from "@/utils/formatters";

const Index = () => {
  const totalSpent = getTotalSpending();
  const currentMonth = getCurrentMonth();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">
          Track your spending and stay on budget with Glance
        </p>
      </div>

      <div className="grid gap-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1">
              {currentMonth} Spending
            </div>
            <div className="text-3xl font-bold text-budget-purple-500 mb-1">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-sm text-gray-500">
              Updated today
            </div>
          </div>
          <BudgetSummaryCard />
        </div>

        <BudgetCards />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SpendingTrendChart />
          </div>
          <div>
            <SpendingByCategory />
          </div>
        </div>

        <RecentTransactions />
      </div>
    </Layout>
  );
};

export default Index;
