"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function replaceFaqs(
  items: { question: string; answer: string }[]
): Promise<{ error?: string }> {
  const s = await getSession();
  if (!s) return { error: "Unauthorized" };

  const clean = items
    .map((i) => ({ question: i.question?.trim(), answer: i.answer?.trim() }))
    .filter((i) => i.question && i.answer)
    .map((i, idx) => ({ question: i.question!, answer: i.answer!, sortOrder: idx }));

  await prisma.$transaction([
    prisma.faq.deleteMany({}),
    prisma.faq.createMany({ data: clean }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return {};
}
