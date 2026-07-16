import { prisma } from "@/lib/prisma";
import DraftCard from "./DraftCard";

export const dynamic = "force-dynamic";

export default async function AbandonedCartsPage() {
  const drafts = await prisma.draftOrder.findMany({
    where: { completedOrderId: null, phone: { not: null } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Abandoned Carts</h1>
        <p className="text-sm text-muted">Customers who started checkout but didn&apos;t complete their order</p>
      </div>

      {drafts.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center text-muted">No abandoned carts right now.</div>
      ) : (
        <div className="grid gap-3">
          {drafts.map((d) => (
            <DraftCard
              key={d.sessionId}
              draft={{
                sessionId: d.sessionId,
                name: d.name,
                phone: d.phone,
                address: d.address,
                productName: d.productName,
                updatedAt: d.updatedAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
