"use client";

import Link from "next/link";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Routes } from "@/lib/constants";

const routes = [
  {
    name: "Dashboard",
    path: Routes.Dashboard,
  },
  {
    name: "Account",
    path: Routes.Account,
  },
];

export default function Header() {
  const activePathname = usePathname();
  return (
    <header className="flex justify-between items-center border-b border-white/10 py-2">
      <Logo />
      <nav>
        <ul className="flex gap-2 text-sm">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "text-white/70 rounded-md px-4 py-2 hover:text-white focus:text-white transition",
                  {
                    "bg-black/10 text-white": route.path === activePathname,
                  }
                )}
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
