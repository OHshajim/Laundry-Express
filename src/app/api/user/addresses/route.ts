import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AddressService } from "@/lib/services/address-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    const userId = (token?.id as string) || (token?.sub as string) || (token?.email as string);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const addresses = await AddressService.getAddresses(userId);
    return NextResponse.json({ success: true, addresses });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load addresses";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    const userId = (token?.id as string) || (token?.sub as string) || (token?.email as string);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const saved = await AddressService.saveAddress({
      ...body,
      user_id: userId,
    });
    return NextResponse.json({ success: true, address: saved }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save address";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Address ID required" }, { status: 400 });
    await AddressService.deleteAddress(id);
    return NextResponse.json({ success: true, message: "Address deleted." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete address";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
