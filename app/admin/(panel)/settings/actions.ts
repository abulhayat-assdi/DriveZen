"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type SettingsPayload = {
  brandName: string;
  tagline: string;
  whatsapp: string;
  phone: string;
  email: string;
  facebookUrl: string;
  messengerUrl: string;
  address: string;
  heroKicker: string;
  heroHeadline: string;
  announcement: string;
  deliveryInside: number;
  deliveryOutside: number;
  currency: string;
  footerText: string;
  logoUrl: string | null;
  primaryColor: string;
  steadfastApiKey: string;
  steadfastSecretKey: string;
  fbPixelId: string;
  fbAccessToken: string;
};

export async function saveSettings(
  p: SettingsPayload
): Promise<{ ok?: boolean; error?: string }> {
  const s = await getSession();
  if (!s) return { error: "Unauthorized" };
  if (!p.brandName?.trim()) return { error: "Please enter a brand name." };

  const data = {
    brandName: p.brandName.trim(),
    tagline: p.tagline?.trim() ?? "",
    whatsapp: p.whatsapp?.trim() ?? "",
    phone: p.phone?.trim() ?? "",
    email: p.email?.trim() || null,
    facebookUrl: p.facebookUrl?.trim() || null,
    messengerUrl: p.messengerUrl?.trim() || null,
    address: p.address?.trim() || null,
    heroKicker: p.heroKicker?.trim() ?? "",
    heroHeadline: p.heroHeadline?.trim() || "The upgrade your drive deserves.",
    announcement: p.announcement?.trim() || null,
    deliveryInside: Math.max(0, Math.round(Number(p.deliveryInside) || 0)),
    deliveryOutside: Math.max(0, Math.round(Number(p.deliveryOutside) || 0)),
    currency: p.currency?.trim() || "৳",
    footerText: p.footerText?.trim() ?? "",
    logoUrl: p.logoUrl || null,
    primaryColor: p.primaryColor?.trim() || "#e0b04f",
    steadfastApiKey: p.steadfastApiKey?.trim() || null,
    steadfastSecretKey: p.steadfastSecretKey?.trim() || null,
    fbPixelId: p.fbPixelId?.trim() || null,
    fbAccessToken: p.fbAccessToken?.trim() || null,
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}
