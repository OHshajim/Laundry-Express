import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ContentService } from "@/lib/services/content-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    if (type === "faqs") {
      const faqs = await ContentService.getFaqs();
      return NextResponse.json({ success: true, faqs });
    }
    if (type === "terms") {
      const terms = await ContentService.getTerms();
      return NextResponse.json({ success: true, terms });
    }
    if (type === "settings") {
      const settings = await ContentService.getSettings();
      return NextResponse.json({ success: true, settings });
    }

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
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { section, item } = body;

    if (section === "faqs") {
      const saved = await ContentService.saveFaq(item);
      return NextResponse.json({ success: true, faq: saved });
    }
    if (section === "terms") {
      const saved = await ContentService.saveTerm(item);
      return NextResponse.json({ success: true, term: saved });
    }
    if (section === "settings") {
      const saved = await ContentService.updateSettings(item);
      return NextResponse.json({ success: true, settings: saved });
    }

    return NextResponse.json({ success: false, error: "Invalid section." }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update content";
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
    const section = req.nextUrl.searchParams.get("section");

    if (section === "faqs" && id) {
      await ContentService.deleteFaq(id);
      return NextResponse.json({ success: true, message: "FAQ deleted." });
    }

    return NextResponse.json({ success: false, error: "Invalid delete parameters." }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete item";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
