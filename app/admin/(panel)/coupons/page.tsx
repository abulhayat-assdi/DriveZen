import { prisma } from "@/lib/prisma";
import CouponRow from "./CouponRow";
import AddCouponForm from "./AddCouponForm";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Coupons</h1>
        <p className="text-sm text-muted">Create and manage discount codes for checkout</p>
      </div>

      <div className="mb-8 space-y-3">
        {coupons.length === 0 ? (
          <div className="card rounded-2xl p-8 text-center text-muted">No coupons yet.</div>
        ) : (
          coupons.map((c) => (
            <CouponRow
              key={c.id}
              coupon={{
                id: c.id,
                code: c.code,
                type: c.type,
                value: c.value,
                minOrderAmount: c.minOrderAmount,
                maxUses: c.maxUses,
                usedCount: c.usedCount,
                expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
                isActive: c.isActive,
              }}
            />
          ))
        )}
      </div>

      <div className="card rounded-2xl p-5">
        <h2 className="mb-4 font-semibold">Add a new coupon</h2>
        <AddCouponForm />
      </div>
    </div>
  );
}
