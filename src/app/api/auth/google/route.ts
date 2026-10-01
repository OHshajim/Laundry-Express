import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Use the Google sign-in button to authenticate." },
    { status: 410, headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
