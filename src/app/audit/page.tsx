import { AuditTrail } from "@/shared/components/AuditTrail";
import { Card } from "@/shared/components/ui/Card";

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-on-surface mb-6 text-xl font-semibold">Trilha de auditoria</h1>
      <Card>
        <AuditTrail />
      </Card>
    </main>
  );
}
