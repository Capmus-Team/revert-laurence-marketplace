"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

type Listing = {
  id: string;
  title: string;
  price: number;
  image_url: string;
  seller_email: string;
  location: string;
  created_at: string;
  description: string;
};

export default function ItemDetailPage() {
  const { id } = useParams() as { id: string };

  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/listing/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItem(data);
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleSendMessage = async () => {
    if (!buyerEmail || !message || !item) return alert("Fill in all fields");

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: item.id,
        buyer_email: buyerEmail,
        seller_email: item.seller_email,
        message,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Message sent!");
      setMessage("");
    } else {
      console.error(data.error);
      toast.error("Failed to send message.");
    }
  };

  if (loading || !item) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </main>
    );
  }
  return (
    <main className="w-full h-[calc(100vh-64px)] bg-gray-50 ">
      <div className="h-full flex flex-col">
        {/* Back Button */}
        <div className="p-4 border-b border-gray-400 bg-white">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left: Image */}
          <section className="flex-1 md:w-3/5 flex items-center justify-center p-4 bg-white border-b md:border-b-0 md:border-r border-gray-400">
            <div className="relative w-full h-96 sm:h-full max-w-xl">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-contain rounded"
              />
            </div>
          </section>

          {/* Right: Details */}
          <section className="flex-1 md:max-w-[340px] p-6 bg-white overflow-auto flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="text-sm">{item.description}</p>
              <p className="text-xl font-bold text-emerald-500">
                ₱{item.price}
              </p>
            </div>

            <Separator />
            <div className="text-sm text-gray-500">
              Listed{" "}
              {formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              })}
              <br />
              {item.location}
            </div>

            <Separator />
            <div className="text-sm">
              <p className="font-medium">Seller Information</p>
              <p className="font-semibold">{item.seller_email}</p>
            </div>

            <Separator />
            <div className="flex flex-col gap-4 font-medium text-sm">
              <label htmlFor="buyerEmail">Your Email:</label>
              <input
                id="buyerEmail"
                type="email"
                placeholder="you@example.com"
                className="p-2 border border-gray-300 rounded bg-gray-50 text-sm"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
              />
              <label htmlFor="message">Send seller a message:</label>
              <textarea
                id="message"
                className="w-full h-36 p-3 border border-gray-300 bg-gray-50 resize-none text-base rounded"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                onClick={handleSendMessage}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black text-base flex gap-2 items-center justify-center"
              >
                SEND
                <Send size={18} />
              </Button>
            </div>

            <Separator />
          </section>
        </div>
      </div>
    </main>
  );
}
