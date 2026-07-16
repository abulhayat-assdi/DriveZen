import { prisma } from "@/lib/prisma";
import BlockedRow from "./BlockedRow";
import AddBlockForm from "./AddBlockForm";

export const dynamic = "force-dynamic";

export default async function BlocklistPage() {
  const entries = await prisma.blockedEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Blocklist</h1>
        <p className="text-sm text-muted">Block specific phone numbers or IP addresses from placing orders</p>
      </div>

      <div className="mb-8 space-y-3">
        {entries.length === 0 ? (
          <div className="card rounded-2xl p-8 text-center text-muted">No blocked entries yet.</div>
        ) : (
          entries.map((e) => (
            <BlockedRow
              key={e.id}
              entry={{
                id: e.id,
                type: e.type,
                value: e.value,
                reason: e.reason,
                createdAt: e.createdAt.toISOString(),
              }}
            />
          ))
        )}
      </div>

      <div className="card rounded-2xl p-5">
        <h2 className="mb-4 font-semibold">Block a phone number or IP</h2>
        <AddBlockForm />
      </div>
    </div>
  );
}
