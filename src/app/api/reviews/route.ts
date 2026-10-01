import { NextResponse, type NextRequest } from "next/server";
import { ReviewService } from "@/lib/services/review-service";
import { getVerifiedUser } from "@/lib/auth-request";

export async function GET(req: NextRequest) {
  try {
    const verified = await getVerifiedUser(req);
    const isAdmin = verified?.user.role === "admin";
    const isPublic = req.nextUrl.searchParams.get("public") === "true";
    const onlyApproved = !isAdmin || isPublic;
    const userId = !isAdmin && !isPublic ? verified?.user.id : undefined;

    const reviews = await ReviewService.getReviews(onlyApproved, userId);
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load reviews";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const verified = await getVerifiedUser(req);
    if (!verified) {
      return NextResponse.json({ success: false, error: "Please sign in to leave a review." }, { status: 401 });
    }

    const body = await req.json();
    const result = await ReviewService.submitReview({
      ...body,
      userId: verified.user.id,
      customerName: verified.user.full_name || "Customer",
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
    const verified = await getVerifiedUser(req);
    if (!verified || verified.user.role !== "admin") {
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
    const verified = await getVerifiedUser(req);
    if (!verified || verified.user.role !== "admin") {
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
