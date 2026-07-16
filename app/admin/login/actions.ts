"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const fromRaw = String(formData.get("from") || "/admin/dashboard");
  const from = fromRaw.startsWith("/admin") ? fromRaw : "/admin/dashboard";

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  await createSession({ uid: user.id, email: user.email });
  redirect(from);
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
