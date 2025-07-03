// src/components/marketplace/item-grid.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type Listing = {
  id: string;
  title: string;
  price: number;
  image_url: string;
};

export function ItemGrid({ items }: { items: Listing[] }) {
  if (items.length === 0) {
    return <p className="text-gray-500">No items found in this category.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/item/${item.id}`}
          className="bg-white border border-gray-300 hover:shadow-sm transition overflow-hidden rounded"
        >
          <div className="relative w-full aspect-square border-b border-gray-200">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="p-2">
            <h2 className="text-sm font-medium truncate">{item.title}</h2>
            <p className="text-xs text-gray-600 font-semibold">
              ₱{item.price.toLocaleString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
