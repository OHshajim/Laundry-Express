import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ReviewService } from "@/lib/services/review-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    const isAdmin = token?.role === "admin";
    const onlyApproved = !isAdmin || req.nextUrl.searchParams.get("public") === "true";

    const reviews = await ReviewService.getReviews(onlyApproved);
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load reviews";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) {
      return NextResponse.json({ success: false, error: "Please sign in to leave a review." }, { status: 401 });
    }

    const body = await req.json();
    const result = await ReviewService.submitReview({
      ...body,
      userId: token.id,
      customerName: token.name || "Customer",
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, review: result.review }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to submit review";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { reviewId, status } = await req.json();
    if (!reviewId || !status) {
      return NextResponse.json({ success: false, error: "Review ID and status are required." }, { status: 400 });
    }

    await ReviewService.updateReviewStatus(reviewId, status);
    return NextResponse.json({ success: true, message: "Review status updated." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update review";
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
    if (!id) return NextResponse.json({ success: false, error: "Review ID is required." }, { status: 400 });

    await ReviewService.deleteReview(id);
    return NextResponse.json({ success: true, message: "Review deleted." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete review";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
