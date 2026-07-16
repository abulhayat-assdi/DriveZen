import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";
import type { SettingsPayload } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const initial: SettingsPayload = {
    brandName: s?.brandName ?? "Drive Zen",
    tagline: s?.tagline ?? "",
    whatsapp: s?.whatsapp ?? "",
    phone: s?.phone ?? "",
    email: s?.email ?? "",
    facebookUrl: s?.facebookUrl ?? "",
    messengerUrl: s?.messengerUrl ?? "",
    address: s?.address ?? "",
    heroKicker: s?.heroKicker ?? "",
    heroHeadline: s?.heroHeadline ?? "",
    announcement: s?.announcement ?? "",
    deliveryInside: s?.deliveryInside ?? 60,
    deliveryOutside: s?.deliveryOutside ?? 120,
    currency: s?.currency ?? "৳",
    footerText: s?.footerText ?? "",
    logoUrl: s?.logoUrl ?? null,
    primaryColor: s?.primaryColor ?? "#e0b04f",
    steadfastApiKey: s?.steadfastApiKey ?? "",
    steadfastSecretKey: s?.steadfastSecretKey ?? "",
    fbPixelId: s?.fbPixelId ?? "",
    fbAccessToken: s?.fbAccessToken ?? "",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted">Brand, contact and site configuration</p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  );
}
