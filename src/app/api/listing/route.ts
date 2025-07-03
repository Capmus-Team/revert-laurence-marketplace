import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for creating a new listing
const ListingSchema = z.object({
  title: z.string(),
  price: z.number(),
  image_url: z.string().url(),
  category: z.string(),
  location: z.string(),
  seller_email: z.string().email(),
  description: z.string().optional(),
});

// GET /api/listings?category=...&search=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";

  let query = supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/listings
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("listings")
    .insert(parsed.data)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
