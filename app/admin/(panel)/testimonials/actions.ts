"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type TestimonialInput = {
  name: string;
  text: string;
  tag: string;
  rating: number;
  isActive: boolean;
};

export async function replaceTestimonials(
  items: TestimonialInput[]
): Promise<{ error?: string }> {
  const s = await getSession();
  if (!s) return { error: "Unauthorized" };

  // Keep only rows with the two required fields; everything else is normalised.
  const clean = items
    .map((i) => ({
      name: i.name?.trim() ?? "",
      text: i.text?.trim() ?? "",
      tag: i.tag?.trim() ?? "",
      rating: Math.min(5, Math.max(1, Math.round(Number(i.rating) || 5))),
      isActive: Boolean(i.isActive),
    }))
    .filter((i) => i.name && i.text)
    .map((i, idx) => ({ ...i, sortOrder: idx }));

  // Full replace keeps sortOrder aligned with the on-screen order — same
  // pattern as the FAQ editor.
  await prisma.$transaction([
    prisma.testimonial.deleteMany({}),
    prisma.testimonial.createMany({ data: clean }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return {};
}
