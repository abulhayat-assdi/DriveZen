"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}

export type AddAdminState = { error?: string; ok?: boolean };

export async function addAdminUser(
  _prev: AddAdminState,
  formData: FormData
): Promise<AddAdminState> {
  await requireAuth();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name) return { error: "Please enter a name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return { error: "This email is already registered." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({ data: { name, email, passwordHash } });

  revalidatePath("/admin/access");
  return { ok: true };
}

export async function deleteAdminUser(id: string): Promise<{ error?: string }> {
  const session = await requireAuth();

  if (session.uid === id) {
    return { error: "You can't remove your own account. Ask another admin to do it." };
  }

  const count = await prisma.adminUser.count();
  if (count <= 1) {
    return { error: "At least one admin account must remain." };
  }

  await prisma.adminUser.delete({ where: { id } });

  revalidatePath("/admin/access");
  return {};
}
