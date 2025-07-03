"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, User, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Separator } from "../ui/separator";
import Link from "next/link";

type SidebarProps = {
  selected?: string;
};

export default function Sidebar({ selected }: SidebarProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("category")
        .neq("category", null);

      if (error) {
        console.error("Error fetching categories:", error.message);
        return;
      }

      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category))
      );
      setCategories(uniqueCategories);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleSelect = (category: string) => {
    if (selected === category) {
      router.push("/"); // Unselect category → go to homepage
    } else {
      router.push(`/category/${category}`);
    }
  };

  return (
    <div className="w-full sm:w-64 bg-white border-gray-300 sm:border-r sm:min-h-full flex flex-col sm:flex-col gap-6 sm:overflow-y-auto">
      {/* Mobile: Unified horizontal bar */}
      <div className=" sm:hidden border-b border-gray-200 overflow-x-auto whitespace-nowrap px-2 py-3 bg-white flex gap-2">
        {/* Create listing shortcuts */}
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-emerald-100 text-sm transition whitespace-nowrap"
        >
          <Tag size={16} /> Create
        </Link>
        <Link
          href="/your-listings"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-emerald-100 text-sm transition whitespace-nowrap"
        >
          <User size={16} /> Yours
        </Link>
        <Link
          href="/help"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-emerald-100 text-sm transition whitespace-nowrap"
        >
          <HelpCircle size={16} /> Help
        </Link>

        {/* Categories */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleSelect(category)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm capitalize whitespace-nowrap transition
        ${
          selected === category
            ? "bg-blue-100 text-emerald-700 font-semibold"
            : "bg-gray-100 text-gray-700 hover:bg-emerald-100"
        }`}
          >
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </button>
        ))}
      </div>

      {/* Desktop: Vertical sidebar */}
      <div className="hidden sm:flex flex-col gap-6 p-4">
        {/* Create listing shortcuts */}
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-base">Create new listing</h2>
          <ul className="flex flex-col gap-2.5 text-sm text-gray-700">
            <li>
              <Link
                href="/create"
                className="flex items-center gap-2.5 hover:text-emerald-600 transition"
              >
                <Tag size={18} /> Choose listing type
              </Link>
            </li>
            <li>
              <Link
                href="/your-listings"
                className="flex items-center gap-2.5 hover:text-emerald-600 transition"
              >
                <User size={18} /> Your listings
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="flex items-center gap-2.5 hover:text-emerald-600 transition"
              >
                <HelpCircle size={18} /> Seller help
              </Link>
            </li>
          </ul>
        </div>

        <Separator />

        {/* Categories list */}
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-base">Categories</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleSelect(category)}
                    className={`w-full text-left px-3 py-1.5 rounded transition text-sm capitalize
                      ${
                        selected === category
                          ? "bg-blue-100 text-emerald-700 font-bold"
                          : "hover:bg-emerald-100"
                      }`}
                  >
                    {category
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
