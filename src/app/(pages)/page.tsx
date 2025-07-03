"use client";

import Sidebar from "@/components/layout/sidebar";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"; // Adjust path based on your setup
import { toast } from "sonner";

type Listing = {
  id: string;
  title: string;
  price: number;
  image_url: string;
};

export default function HomePage() {
  const [selectedCategory] = useState("");
  const [items, setItems] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (search.trim()) params.append("search", search.trim());

        const res = await fetch(`/api/listing?${params.toString()}`);
        const data = await res.json();

        if (res.ok) {
          setItems(data);
        } else {
          toast("Error fetching listings:", data.error);
        }
      } catch (error) {
        toast.error(
          `Fetch failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [selectedCategory, search]);

  return (
    <main className="h-[calc(100vh-64px)] flex flex-col sm:flex-row overflow-hidden bg-gray-50">
      {/* Sidebar - stacks on top on mobile */}
      <div className="sm:w-64 w-full border-b sm:border-b-0 sm:border-r border-gray-300">
        <Sidebar selected={selectedCategory} />
      </div>

      {/* Main content */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b bg-white">
          <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-full"
          />
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No items found.</p>
          ) : (
            <ItemGrid items={items} />
          )}
        </div>
      </section>
    </main>
  );
}
