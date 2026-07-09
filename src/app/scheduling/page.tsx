import { SchedulingList } from "@/features/scheduling/components/SchedulingList";
import { Card } from "@/shared/components/ui/Card";

export default function SchedulingPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Central de agendamento</h1>
      <Card>
        <SchedulingList />
      </Card>
    </main>
  );
}
