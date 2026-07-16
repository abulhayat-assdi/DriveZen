"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

export async function dismissDraft(sessionId: string) {
  await requireAuth();
  await prisma.draftOrder.delete({ where: { sessionId } }).catch(() => {});
  revalidatePath("/admin/abandoned-carts");
}
