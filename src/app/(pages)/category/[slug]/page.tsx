"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Listing = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
};

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/listing?category=${slug}&search=${search}`
        );
        const data = await res.json();

        if (res.ok) {
          setItems(data);
        } else {
          toast.error("Failed to fetch listings:", data.error);
          setItems([]);
        }
      } catch (err) {
        toast.error(
          `Error fetching listings: ${
            err instanceof Error ? err.message : String(err)
          }`
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [slug, search]);

  return (
    <main className="h-[calc(100vh-64px)] flex flex-col sm:flex-row overflow-hidden bg-gray-50">
      {/* Sidebar - stacks on top on mobile */}
      <div className="sm:w-64 w-full border-b sm:border-b-0 sm:border-r border-gray-300">
        <Sidebar selected={slug} />
      </div>

      {/* Main content */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b bg-white">
          <Input
            placeholder={`Search in ${slug.replace(/-/g, " ")}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
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
