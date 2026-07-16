"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

export type ProductPayload = {
  id?: string;
  name: string;
  tagline: string;
  badge: string;
  price: number;
  oldPrice: number | null;
  priceNote: string;
  shortDesc: string;
  description: string;
  heroImage: string | null;
  isActive: boolean;
  images: { url: string; alt: string }[];
  features: { text: string }[];
  highlights: { title: string; description: string; imageUrl: string | null }[];
};

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

export async function saveProduct(
  payload: ProductPayload
): Promise<{ error?: string }> {
  await requireAuth();

  const name = payload.name?.trim();
  if (!name) return { error: "Please enter a product name." };

  const scalar = {
    name,
    tagline: payload.tagline?.trim() ?? "",
    badge: payload.badge?.trim() || null,
    price: Math.max(0, Math.round(Number(payload.price) || 0)),
    oldPrice:
      payload.oldPrice && Number(payload.oldPrice) > 0
        ? Math.round(Number(payload.oldPrice))
        : null,
    priceNote: payload.priceNote?.trim() || null,
    shortDesc: payload.shortDesc?.trim() ?? "",
    description: payload.description?.trim() ?? "",
    heroImage: payload.heroImage || null,
    isActive: !!payload.isActive,
  };

  const images = (payload.images ?? [])
    .filter((i) => i.url)
    .map((i, idx) => ({ url: i.url, alt: i.alt?.trim() ?? "", sortOrder: idx }));
  const features = (payload.features ?? [])
    .filter((f) => f.text?.trim())
    .map((f, idx) => ({ text: f.text.trim(), sortOrder: idx }));
  const highlights = (payload.highlights ?? [])
    .filter((h) => h.title?.trim())
    .map((h, idx) => ({
      title: h.title.trim(),
      description: h.description?.trim() ?? "",
      imageUrl: h.imageUrl || null,
      sortOrder: idx,
    }));

  if (payload.id) {
    const id = payload.id;
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.feature.deleteMany({ where: { productId: id } }),
      prisma.highlight.deleteMany({ where: { productId: id } }),
      prisma.product.update({
        where: { id },
        data: {
          ...scalar,
          images: { create: images },
          features: { create: features },
          highlights: { create: highlights },
        },
      }),
    ]);
    if (scalar.isActive) {
      await prisma.product.updateMany({
        where: { id: { not: id } },
        data: { isActive: false },
      });
    }
  } else {
    const created = await prisma.product.create({
      data: {
        ...scalar,
        images: { create: images },
        features: { create: features },
        highlights: { create: highlights },
      },
    });
    if (scalar.isActive) {
      await prisma.product.updateMany({
        where: { id: { not: created.id } },
        data: { isActive: false },
      });
    }
  }

  revalidateAll();
  redirect("/admin/products");
}

export async function setActiveProduct(id: string) {
  await requireAuth();
  await prisma.$transaction([
    prisma.product.updateMany({ data: { isActive: false } }),
    prisma.product.update({ where: { id }, data: { isActive: true } }),
  ]);
  revalidateAll();
}

export async function deleteProduct(id: string) {
  await requireAuth();
  await prisma.product.delete({ where: { id } });
  revalidateAll();
}
