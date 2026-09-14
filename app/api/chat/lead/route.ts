import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendNtfy } from "@/lib/ntfy";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const message = String(body.message || "").trim().slice(0, 2000);

  if (!email || !message) {
    return NextResponse.json({ error: "email and message required" }, { status: 400 });
  }

  const prisma = await getPrisma();
  await prisma.lead.create({
    data: { name: name || "Chat lead", email, message, source: "chatbot" },
  });
  await sendNtfy({ name: name || "Chat lead", email, message, source: "chatbot" });

  return NextResponse.json({ ok: true });
}