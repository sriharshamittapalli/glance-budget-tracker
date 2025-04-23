
import Layout from "@/components/layout/Layout";

export default function BudgetsPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Budgets</h1>
        <p className="text-gray-600">Set and manage your budget goals</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-center text-gray-500 py-20">Budget management features will be available in the next update.</p>
      </div>
    </Layout>
  );
}
