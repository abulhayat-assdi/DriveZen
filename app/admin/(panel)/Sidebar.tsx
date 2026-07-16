"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/admin/login/actions";
import {
  Grid,
  Bag,
  Box,
  Help,
  Cog,
  Edit,
  Logout,
  External,
  Menu,
  Close,
} from "@/components/icons";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Grid },
  { href: "/admin/order", label: "Orders", icon: Bag },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/content", label: "Content Management", icon: Edit },
  { href: "/admin/faqs", label: "FAQs", icon: Help },
  { href: "/admin/settings", label: "Settings", icon: Cog },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavList = (
    <nav className="grid gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              active
                ? "bg-gold/10 font-semibold text-gold"
                : "text-muted hover:bg-surface hover:text-fg"
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-xs font-extrabold text-gold">
            DZ
          </span>
          <span className="font-display font-bold">Drive Zen</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line"
        >
          {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-line bg-ink-2 p-4">
            <div className="mb-6 mt-2">{NavList}</div>
            <LogoutBlock email={email} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-ink-2 p-4 lg:flex">
        <Link href="/admin/dashboard" className="mb-8 mt-2 flex items-center gap-2.5 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-sm font-extrabold text-gold">
            DZ
          </span>
          <span className="font-display text-lg font-bold">Drive Zen</span>
        </Link>
        {NavList}
        <div className="mt-auto">
          <LogoutBlock email={email} />
        </div>
      </aside>
    </>
  );
}

function LogoutBlock({ email }: { email: string }) {
  return (
    <div className="border-t border-line pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition hover:bg-surface hover:text-fg"
      >
        <External className="h-[18px] w-[18px]" /> View site
      </a>
      <form action={logoutAction}>
        <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition hover:bg-surface hover:text-red-300">
          <Logout className="h-[18px] w-[18px]" /> Log out
        </button>
      </form>
      <p className="mt-3 truncate px-3.5 text-xs text-muted-2">{email}</p>
    </div>
  );
}
