"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { STATUS_ORDER, type OrderStatus } from "./status";
import { sendToSteadfast } from "@/lib/steadfast";

async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
}

export async function updateOrderStatus(id: string, status: string) {
  await requireAuth();
  if (!STATUS_ORDER.includes(status as OrderStatus)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/order");
  revalidatePath("/admin/dashboard");
}

export type OrderEditFields = {
  customerName: string;
  phone: string;
  address: string;
  note: string;
  quantity: number;
  area: "inside" | "outside";
  status: string;
};

export async function updateOrder(
  id: string,
  fields: OrderEditFields
): Promise<{ ok?: boolean; error?: string }> {
  await requireAuth();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return { error: "Order not found." };

  const customerName = fields.customerName.trim();
  const phone = fields.phone.trim();
  const address = fields.address.trim();
  if (customerName.length < 2) return { error: "Please enter a valid name." };
  if (address.length < 5) return { error: "Please enter a full address." };

  const quantity = Math.max(1, Math.min(99, Math.round(fields.quantity) || 1));
  const area = fields.area === "outside" ? "outside" : "inside";
  const status = STATUS_ORDER.includes(fields.status as OrderStatus)
    ? fields.status
    : order.status;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const deliveryCharge =
    area === "outside" ? settings?.deliveryOutside ?? order.deliveryCharge : settings?.deliveryInside ?? order.deliveryCharge;
  const total = order.unitPrice * quantity + deliveryCharge;

  await prisma.order.update({
    where: { id },
    data: {
      customerName,
      phone: phone.replace(/[^0-9]/g, "") || phone,
      address,
      note: fields.note.trim() || null,
      quantity,
      area,
      deliveryCharge,
      total,
      status,
    },
  });

  revalidatePath("/admin/order");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteOrder(id: string) {
  await requireAuth();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/order");
  revalidatePath("/admin/dashboard");
}

export async function sendOrderToCourier(
  id: string
): Promise<{ ok?: boolean; error?: string; trackingCode?: string }> {
  await requireAuth();

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { id } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);
  if (!order) return { error: "Order not found." };
  if (order.status === "cancelled") return { error: "Cancelled orders can't be sent to courier." };
  if (order.courierConsignmentId) return { error: "This order was already sent to the courier." };

  if (!settings?.steadfastApiKey || !settings?.steadfastSecretKey) {
    return { error: "Add your Steadfast API Key and Secret Key in Settings first." };
  }

  const result = await sendToSteadfast(
    {
      invoice: order.orderNumber,
      recipientName: order.customerName,
      recipientPhone: order.phone,
      recipientAddress: order.address,
      codAmount: order.total,
      note: order.note ?? undefined,
    },
    { apiKey: settings.steadfastApiKey, secretKey: settings.steadfastSecretKey }
  );

  if (!result.ok) return { error: result.error };

  await prisma.order.update({
    where: { id },
    data: {
      courierConsignmentId: result.consignmentId,
      courierTrackingCode: result.trackingCode,
      courierStatus: result.status ?? "in_review",
      courierSentAt: new Date(),
      status: "on_the_way",
    },
  });

  revalidatePath("/admin/order");
  revalidatePath("/admin/dashboard");
  return { ok: true, trackingCode: result.trackingCode };
}
