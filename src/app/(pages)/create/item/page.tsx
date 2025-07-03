"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CreateItemPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "furniture", label: "Furniture" },
    { value: "vehicles", label: "Vehicles" },
    { value: "property-rentals", label: "Property Rentals" },
    { value: "apparel", label: "Apparel" },
    { value: "classifieds", label: "Classifieds" },
    { value: "entertainment", label: "Entertainment" },
    { value: "family", label: "Family" },
    { value: "free-stuff", label: "Free Stuff" },
    { value: "garden-outdoor", label: "Garden & Outdoor" },
    { value: "hobbies", label: "Hobbies" },
    { value: "home-goods", label: "Home Goods" },
    { value: "home-improvement", label: "Home Improvement" },
    { value: "home-sales", label: "Home Sales" },
    { value: "musical-instruments", label: "Musical Instruments" },
    { value: "office-supplies", label: "Office Supplies" },
    { value: "pet-supplies", label: "Pet Supplies" },
    { value: "sporting-goods", label: "Sporting Goods" },
    { value: "toys-games", label: "Toys & Games" },
    { value: "buy-and-sell-groups", label: "Buy and sell groups" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // inside form submission handler (client component)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) return toast.error("Please upload an image");

    try {
      // STEP 1: Upload image
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Image upload failed");
      }

      const imageUrl = uploadData.url;

      // STEP 2: Post listing with uploaded image URL
      const listing = {
        title,
        price: Number(price),
        image_url: imageUrl,
        description,
        category,
        location,
        seller_email: sellerEmail,
      };

      const listingRes = await fetch("/api/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing),
      });

      const listingData = await listingRes.json();

      if (!listingRes.ok) {
        throw new Error(listingData.error || "Listing creation failed");
      }

      toast.success("Listing created!");
      console.log("Listing data:", listingData);
      // Optionally: redirect or reset form
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <main className="flex flex-col flex-1 border-t border-gray-400 bg-gray-100">
      <div className="flex flex-col md:flex-row flex-1 overflow-auto">
        {/* Left: Form */}
        <aside className="w-full md:w-[320px] bg-white p-5 border-b md:border-b-0 md:border-r border-gray-400 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
            {/* Upload Area */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setImage(file);
                  setPreviewUrl(URL.createObjectURL(file));
                } else {
                  toast.error("Only image files are allowed.");
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center border-2 border-dashed h-40 cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image-upload"
                className="w-full h-full flex items-center justify-center"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-sm font-medium">
                    Click or drag image here
                  </span>
                )}
              </label>
            </div>

            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-100"
            />
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-100"
            />
            <Input
              type="email"
              placeholder="Email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              className="bg-gray-100"
            />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-100"
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-100 min-h-[80px]"
            />
            <Select onValueChange={setCategory}>
              <SelectTrigger className="bg-gray-100">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1" />
            <Button
              type="submit"
              className="w-full font-semibold text-black bg-emerald-500 hover:bg-emerald-400"
            >
              NEXT
              <ArrowRight />
            </Button>
          </form>
        </aside>

        {/* Center: Image Preview */}
        <section className="w-full md:flex-1 flex flex-col items-center justify-start p-6 bg-gray-100 border-b md:border-b-0 md:border-r border-gray-400 overflow-y-auto">
          <div className="text-lg font-semibold mb-4">Preview</div>
          <div className="w-full max-w-md flex items-center justify-center bg-white border-1 p-4 ">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={400}
                height={400}
                className="w-full h-auto max-h-[400px] object-contain"
              />
            ) : (
              <div className="text-gray-300 text-2xl w-[300px] h-[300px] flex items-center justify-center border border-dashed">
                Image Preview
              </div>
            )}
          </div>
        </section>

        {/* Right: Listing Info */}
        <aside className="w-full md:w-[320px] p-6 bg-white flex flex-col gap-4 overflow-y-auto border-gray-400">
          <div className="py-4">
            <div className="text-xl font-bold">
              {title || "Title goes here"}
            </div>
            <div className="text-lg font-semibold text-green-600">
              {price ? `₱${price}` : "Price"}
            </div>
          </div>

          <Separator />
          <div className="text-sm py-2 text-gray-500">
            Listed just now at:
            <br />
            {location}
          </div>
          <Separator />
          <div className="py-2">
            <div className="text-sm text-gray-700 font-medium mb-1">
              Seller Information:
            </div>
            <div className="text-sm font-semibold">{sellerEmail}</div>
          </div>

          <Separator />
        </aside>
      </div>
    </main>
  );
}
