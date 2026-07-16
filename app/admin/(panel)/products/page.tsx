import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductRow from "./ProductRow";
import { Plus } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted">Add, edit and set the active product</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-gold inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center">
          <p className="text-muted">No products yet.</p>
          <Link href="/admin/products/new" className="btn-gold mt-4 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <ProductRow
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                price: p.price,
                isActive: p.isActive,
                image: p.heroImage || p.images[0]?.url || null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
