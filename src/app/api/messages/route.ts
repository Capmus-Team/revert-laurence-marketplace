import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const MessageSchema = z.object({
  listing_id: z.string().uuid(),
  buyer_email: z.string().email(),
  seller_email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = MessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert(parsed.data)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
