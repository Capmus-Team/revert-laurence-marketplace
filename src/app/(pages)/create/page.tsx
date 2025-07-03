"use client";

import Sidebar from "@/components/layout/sidebar";
import Link from "next/link";
import { Package, Layers3, Car, Home } from "lucide-react";

export default function CreatePage() {
  const types = [
    {
      title: "Item for sale",
      subtitle: "Sell electronics, furniture, clothes & more",
      icon: <Package size={28} className="text-emerald-600" />,
      href: "/create/item",
    },
    {
      title: "Create multiple listings",
      subtitle: "For power sellers or bulk upload",
      icon: <Layers3 size={28} className="text-emerald-600" />,
      href: "#",
    },
    {
      title: "Vehicle for sale",
      subtitle: "Post a car, motorbike, or other vehicle",
      icon: <Car size={28} className="text-emerald-600" />,
      href: "#",
    },
    {
      title: "Home for sale or rent",
      subtitle: "List a house, condo, or rental unit",
      icon: <Home size={28} className="text-emerald-600" />,
      href: "#",
    },
  ];
  return (
    <main className="h-[calc(100vh-64px)] flex flex-col sm:flex-row overflow-hidden bg-gray-50">
      {/* Sidebar stacks on top on mobile */}
      <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b bg-white">
          <h1 className="text-xl sm:text-2xl font-bold capitalize">
            Create Listing
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
          <h2 className="text-xl sm:text-3xl font-extrabold mb-6 text-center">
            Choose listing type
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
            {types.map((type) => (
              <Link
                key={type.title}
                href={type.href}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition hover:-translate-y-1"
              >
                <div className="w-14 h-14 border-2 border-emerald-200 rounded-full mb-4 flex items-center justify-center bg-emerald-50">
                  {type.icon}
                </div>
                <div className="font-semibold text-base mb-1">{type.title}</div>
                <div className="text-sm text-gray-600">{type.subtitle}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
