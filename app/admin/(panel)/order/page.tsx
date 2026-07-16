import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderCard from "./OrderCard";
import { STATUS_META, STATUS_ORDER } from "./status";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.status && STATUS_ORDER.includes(sp.status as never) ? sp.status : "new";

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where: { status: filter },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  const tabs = STATUS_ORDER.map((s) => ({
    key: s,
    label: STATUS_META[s].label,
    count: countMap[s] ?? 0,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted">View orders and update their status</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "new" ? "/admin/order" : `/admin/order?status=${t.key}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              filter === t.key
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-line bg-surface text-muted hover:text-fg"
            }`}
          >
            {t.label} <span className="ml-1 text-xs opacity-70">{t.count}</span>
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center text-muted">
          No orders in this filter.
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={{
                ...o,
                createdAt: o.createdAt.toISOString(),
                courierSentAt: o.courierSentAt ? o.courierSentAt.toISOString() : null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
