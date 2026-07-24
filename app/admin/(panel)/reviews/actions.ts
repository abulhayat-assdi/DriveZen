"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ReviewImageInput = {
  imageUrl: string;
  caption: string;
  isActive: boolean;
};

export async function replaceReviewImages(
  items: ReviewImageInput[]
): Promise<{ error?: string }> {
  const s = await getSession();
  if (!s) return { error: "Unauthorized" };

  // A row without an uploaded image is meaningless — drop it.
  const clean = items
    .map((i) => ({
      imageUrl: i.imageUrl?.trim() ?? "",
      caption: i.caption?.trim() ?? "",
      isActive: Boolean(i.isActive),
    }))
    .filter((i) => i.imageUrl)
    .map((i, idx) => ({ ...i, sortOrder: idx }));

  await prisma.$transaction([
    prisma.reviewImage.deleteMany({}),
    prisma.reviewImage.createMany({ data: clean }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return {};
}
