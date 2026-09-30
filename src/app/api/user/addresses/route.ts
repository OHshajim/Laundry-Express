import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AddressService } from "@/lib/services/address-service";
import { getAuthSecret } from "@/lib/auth-secret";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const addresses = await AddressService.getAddresses(token.id);
    return NextResponse.json({ success: true, addresses });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load addresses";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const saved = await AddressService.saveAddress({
      ...body,
      user_id: token.id,
    });
    return NextResponse.json({ success: true, address: saved }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save address";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Address ID required" }, { status: 400 });
    const deleted = await AddressService.deleteAddress(id, token.id);
    if (!deleted) return NextResponse.json({ success: false, error: "Address not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Address deleted." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete address";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
