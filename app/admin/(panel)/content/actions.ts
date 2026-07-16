"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CONTENT_FIELDS } from "@/lib/content";

export async function saveContent(
  values: Record<string, string>
): Promise<{ ok?: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const validKeys = new Set(CONTENT_FIELDS.map((f) => f.key));
  const entries = Object.entries(values).filter(([k]) => validKeys.has(k));

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { ok: true };
}

export async function resetContentField(key: string) {
  const session = await getSession();
  if (!session) return;
  await prisma.siteContent.deleteMany({ where: { key } });
  revalidatePath("/");
  revalidatePath("/admin/content");
}
