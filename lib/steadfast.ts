import "server-only";

const STEADFAST_BASE_URL = "https://portal.packzy.com/api/v1";

export type SteadfastOrderInput = {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  codAmount: number;
  note?: string;
};

export type SteadfastCredentials = {
  apiKey: string;
  secretKey: string;
};

export type SteadfastResult =
  | { ok: true; consignmentId: string; trackingCode: string; status?: string }
  | { ok: false; error: string };

export async function sendToSteadfast(
  order: SteadfastOrderInput,
  creds: SteadfastCredentials
): Promise<SteadfastResult> {
  try {
    const res = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": creds.apiKey,
        "Secret-Key": creds.secretKey,
      },
      body: JSON.stringify({
        invoice: order.invoice,
        recipient_name: order.recipientName,
        recipient_phone: order.recipientPhone,
        recipient_address: order.recipientAddress,
        cod_amount: order.codAmount,
        note: order.note ?? "",
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      return {
        ok: false,
        error: data?.message || `Courier request failed (${res.status}).`,
      };
    }

    const consignment = data.consignment;
    if (!consignment?.consignment_id || !consignment?.tracking_code) {
      return { ok: false, error: data.message || "Courier did not return a tracking code." };
    }

    return {
      ok: true,
      consignmentId: String(consignment.consignment_id),
      trackingCode: String(consignment.tracking_code),
      status: consignment.status,
    };
  } catch {
    return { ok: false, error: "Could not reach the Steadfast API. Check your network and API keys." };
  }
}
