import { Bell, LayoutDashboard, Mail, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-400 bg-white px-4 h-16 flex items-center justify-between shadow-sm">
      {/* Logo & Title */}
      <Link
        href="/"
        className="flex items-center gap-3 text-emerald-500 hover:text-emerald-600 transition"
      >
        <LayoutDashboard size={28} />
        <h1 className="text-lg font-bold">Wallence Marketplace</h1>
      </Link>

      {/* Icons */}
      <div className="flex items-center px-5 gap-4 text-gray-600">
        <button
          aria-label="Notifications"
          className="hover:text-emerald-500 transition"
        >
          <Bell size={22} />
        </button>
        <button
          aria-label="Messages"
          className="hover:text-emerald-500 transition"
        >
          <Mail size={22} />
        </button>
        <button
          aria-label="Profile"
          className="hover:text-emerald-500 transition"
        >
          <User size={22} />
        </button>
      </div>
    </header>
  );
}
