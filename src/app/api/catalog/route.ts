import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { CatalogService } from "@/lib/services/catalog-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: AUTH_SECRET });
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  if (token.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  return null;
};

export async function GET(req: NextRequest) {
  try {
    const catalog = await CatalogService.getCatalog();
    const token = await getToken({ req, secret: AUTH_SECRET });
    const detergents = token?.role === "admin"
      ? catalog.detergents
      : catalog.detergents.filter((item) => item.is_active);
    return NextResponse.json({ success: true, detergents }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load catalog";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const body = await req.json();
    const saved = await CatalogService.saveDetergent(body);
    return NextResponse.json({ success: true, item: saved });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save detergent";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const body = await req.json();
    const saved = await CatalogService.saveDetergent(body);
    return NextResponse.json({ success: true, item: saved });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update detergent";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Item ID required" }, { status: 400 });
    await CatalogService.deleteItem(id);
    return NextResponse.json({ success: true, message: "Detergent deleted." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete detergent";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
