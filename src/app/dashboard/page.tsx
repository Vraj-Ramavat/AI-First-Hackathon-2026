import DashboardLayout from "@/src/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Dashboard | StockSaathi Kirana Inventory Intelligence",
  description: "Live inventory monitor, 7-day demand sparklines, and automated WhatsApp reorder alerts for Kirana store owners.",
};

export default function DashboardPage() {
  return <DashboardLayout />;
}
