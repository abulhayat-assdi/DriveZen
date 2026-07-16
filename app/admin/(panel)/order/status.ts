export type OrderStatus = "new" | "on_the_way" | "confirmed" | "cancelled";

export const STATUS_ORDER: OrderStatus[] = ["new", "on_the_way", "confirmed", "cancelled"];

export const STATUS_META: Record<
  string,
  { label: string; badge: string }
> = {
  new: { label: "New Order", badge: "bg-amber-500/15 text-amber-400" },
  on_the_way: { label: "On the way", badge: "bg-sky-500/15 text-sky-400" },
  confirmed: { label: "Confirmed", badge: "bg-emerald-500/15 text-emerald-400" },
  cancelled: { label: "Cancelled / Fake", badge: "bg-red-500/15 text-red-400" },
};
