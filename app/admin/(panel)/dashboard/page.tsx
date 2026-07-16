import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTaka } from "@/lib/utils";
import { Bag, Box, Check, Truck } from "@/components/icons";
import { STATUS_META } from "../order/status";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [total, newOrders, onTheWay, confirmed, cancelled, products, recent, revenueAgg] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "new" } }),
      prisma.order.count({ where: { status: "on_the_way" } }),
      prisma.order.count({ where: { status: "confirmed" } }),
      prisma.order.count({ where: { status: "cancelled" } }),
      prisma.product.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "confirmed" },
      }),
    ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    { label: "Total orders", value: total, icon: Bag, tone: "text-gold bg-gold/10 border-gold/25" },
    { label: "New orders", value: newOrders, icon: Truck, tone: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
    { label: "On the way", value: onTheWay, icon: Truck, tone: "text-sky-400 bg-sky-500/10 border-sky-500/25" },
    { label: "Confirmed", value: confirmed, icon: Check, tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
    { label: "Cancelled / Fake", value: cancelled, icon: Box, tone: "text-red-400 bg-red-500/10 border-red-500/25" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your store</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card rounded-2xl p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-xl border ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card rounded-2xl p-5 lg:col-span-1">
          <p className="text-sm text-muted">Revenue from confirmed orders</p>
          <p className="mt-2 font-display text-3xl font-bold text-gold">
            {formatTaka(revenue)}
          </p>
          <p className="mt-1 text-xs text-muted-2">{newOrders} new orders awaiting action</p>
        </div>

        <div className="card rounded-2xl p-5 lg:col-span-2">
          <p className="mb-2 text-sm font-semibold text-muted">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/order" className="rounded-xl border border-line bg-surface px-4 py-2 text-sm hover:border-gold/50">
              View orders
            </Link>
            <Link href="/admin/products/new" className="rounded-xl border border-line bg-surface px-4 py-2 text-sm hover:border-gold/50">
              New product
            </Link>
            <Link href="/admin/settings" className="rounded-xl border border-line bg-surface px-4 py-2 text-sm hover:border-gold/50">
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent orders</h2>
          <Link href="/admin/order" className="text-sm text-gold hover:underline">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="card rounded-2xl p-8 text-center text-muted">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-2 text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Product</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recent.map((o) => {
                  const meta = STATUS_META[o.status] ?? STATUS_META.new;
                  return (
                    <tr key={o.id} className="bg-surface/30">
                      <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.customerName}</div>
                        <div className="text-xs text-muted">{o.phone}</div>
                      </td>
                      <td className="hidden max-w-[180px] truncate px-4 py-3 text-muted sm:table-cell">
                        {o.productName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gold">
                        {formatTaka(o.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs ${meta.badge}`}>
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
