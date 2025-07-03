import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from("listing-images")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage
    .from("listing-images")
    .getPublicUrl(data.path);

  return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
}
