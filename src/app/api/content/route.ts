import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ContentService } from "@/lib/services/content-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: AUTH_SECRET });
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  if (token.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  return null;
};

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    if (type === "faqs") return NextResponse.json({ success: true, faqs: await ContentService.getFaqs() });
    if (type === "terms") return NextResponse.json({ success: true, terms: await ContentService.getTerms() });
    if (type === "settings") return NextResponse.json({ success: true, settings: await ContentService.getSettings() });

    const [faqs, terms, settings] = await Promise.all([
      ContentService.getFaqs(),
      ContentService.getTerms(),
      ContentService.getSettings(),
    ]);
    return NextResponse.json({ success: true, faqs, terms, settings });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load content";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const { section, item } = await req.json();
    if (section === "faqs") return NextResponse.json({ success: true, faq: await ContentService.saveFaq(item) });
    if (section === "terms") return NextResponse.json({ success: true, term: await ContentService.saveTerm(item) });
    if (section === "settings") return NextResponse.json({ success: true, settings: await ContentService.updateSettings(item) });
    return NextResponse.json({ success: false, error: "Invalid section." }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update content";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const id = req.nextUrl.searchParams.get("id");
    const section = req.nextUrl.searchParams.get("section");

    if (!id) return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });

    if (section === "faqs") {
      await ContentService.deleteFaq(id);
      return NextResponse.json({ success: true, message: "FAQ deleted." });
    }
    if (section === "terms") {
      await ContentService.deleteTerm(id);
      return NextResponse.json({ success: true, message: "Term deleted." });
    }

    return NextResponse.json({ success: false, error: "Invalid section." }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete item";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
