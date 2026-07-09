import { MonitoringScreen } from "@/features/sales-orders/components/MonitoringScreen";
import { Card } from "@/shared/components/ui/Card";

export default function MonitoringPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Monitoramento operacional</h1>
      <Card>
        <MonitoringScreen />
      </Card>
    </main>
  );
}
