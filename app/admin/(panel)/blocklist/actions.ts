"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { normalizeBdPhone } from "@/lib/phone";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

export type AddBlockState = { error?: string; ok?: boolean };

export async function addBlockedEntry(
  _prev: AddBlockState,
  formData: FormData
): Promise<AddBlockState> {
  await requireAuth();

  const type = formData.get("type") === "ip" ? "ip" : "phone";
  const rawValue = String(formData.get("value") || "").trim();
  const reason = String(formData.get("reason") || "").trim() || null;

  let value: string;
  if (type === "phone") {
    const normalized = normalizeBdPhone(rawValue);
    if (!normalized) return { error: "Please enter a valid 11-digit mobile number." };
    value = normalized;
  } else {
    if (!rawValue) return { error: "Please enter an IP address." };
    value = rawValue;
  }

  const existing = await prisma.blockedEntry.findUnique({ where: { type_value: { type, value } } });
  if (existing) return { error: "This entry is already blocked." };

  await prisma.blockedEntry.create({ data: { type, value, reason } });

  revalidatePath("/admin/blocklist");
  return { ok: true };
}

export async function deleteBlockedEntry(id: string) {
  await requireAuth();
  await prisma.blockedEntry.delete({ where: { id } });
  revalidatePath("/admin/blocklist");
}
