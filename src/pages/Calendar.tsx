
import Layout from "@/components/layout/Layout";

export default function CalendarPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Calendar</h1>
        <p className="text-gray-600">View your financial calendar</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-center text-gray-500 py-20">Calendar features will be available in the next update.</p>
      </div>
    </Layout>
  );
}
