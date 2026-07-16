import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Drive Zen" };

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ink">
      <Sidebar email={session.email} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
