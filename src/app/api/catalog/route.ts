import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { CatalogService } from "@/lib/services/catalog-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

export async function GET() {
  try {
    const catalog = await CatalogService.getCatalog();
    return NextResponse.json({ success: true, ...catalog }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load catalog";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }
    const body = await req.json();
    if (body.catalogType === "temperature") {
      const saved = await CatalogService.saveTemperature(body);
      return NextResponse.json({ success: true, item: saved });
    }
    const saved = await CatalogService.saveDetergent(body);
    return NextResponse.json({ success: true, item: saved });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save item";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Item ID required" }, { status: 400 });

    await CatalogService.deleteDetergent(id);
    return NextResponse.json({ success: true, message: "Item deleted." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete item";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
