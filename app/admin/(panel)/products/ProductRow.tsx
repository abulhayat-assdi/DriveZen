"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { formatTaka } from "@/lib/utils";
import { setActiveProduct, deleteProduct } from "./actions";
import { Trash, Eye } from "@/components/icons";

type Row = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  image: string | null;
};

export default function ProductRow({ product }: { product: Row }) {
  const [pending, start] = useTransition();

  return (
    <div className="card flex items-center gap-4 rounded-2xl p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-ink-2">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted-2">No image</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{product.name}</p>
          {product.isActive && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-400">
              Active
            </span>
          )}
        </div>
        <p className="text-sm text-gold">{formatTaka(product.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        {!product.isActive && (
          <button
            onClick={() => start(() => setActiveProduct(product.id))}
            disabled={pending}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-xs text-muted hover:border-gold/50 hover:text-fg"
          >
            Set active
          </button>
        )}
        <Link
          href={`/admin/products/${product.id}`}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-gold/50 hover:text-fg"
          title="Edit"
        >
          <Eye className="h-4 w-4" />
        </Link>
        <button
          onClick={() => {
            if (confirm(`Delete "${product.name}"?`)) start(() => deleteProduct(product.id));
          }}
          disabled={pending}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400"
          title="Delete"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
