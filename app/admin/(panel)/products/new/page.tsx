import ProductEditor from "@/components/admin/ProductEditor";
import type { ProductPayload } from "../actions";

export const dynamic = "force-dynamic";

const EMPTY: ProductPayload = {
  name: "",
  tagline: "",
  badge: "",
  price: 0,
  oldPrice: null,
  priceNote: "",
  shortDesc: "",
  description: "",
  heroImage: null,
  isActive: false,
  images: [],
  features: [],
  highlights: [],
};

export default function NewProductPage() {
  return <ProductEditor initial={EMPTY} />;
}
