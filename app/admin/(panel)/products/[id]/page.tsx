import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductEditor from "@/components/admin/ProductEditor";
import type { ProductPayload } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      features: { orderBy: { sortOrder: "asc" } },
      highlights: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!p) notFound();

  const initial: ProductPayload = {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    badge: p.badge ?? "",
    price: p.price,
    oldPrice: p.oldPrice,
    priceNote: p.priceNote ?? "",
    shortDesc: p.shortDesc,
    description: p.description,
    heroImage: p.heroImage,
    isActive: p.isActive,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
    features: p.features.map((f) => ({ text: f.text })),
    highlights: p.highlights.map((h) => ({
      title: h.title,
      description: h.description,
      imageUrl: h.imageUrl,
    })),
  };

  return <ProductEditor initial={initial} />;
}
