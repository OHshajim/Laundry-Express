import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ImageStorageService } from "@/lib/services/image-storage-service";
import { UserDbService } from "@/lib/services/user-db-service";

/**
 * POST /api/user/avatar
 *
 * Dedicated endpoint for customer and administrator profile picture uploads:
 * - Requires session authentication and verifies authorization (prevents IDOR)
 * - Validates file types (JPEG, PNG, WebP) and 5MB size limits
 * - Uploads asset to Supabase 'avatars' storage bucket
 * - Persists generated public CDN URL into public.users database
 * - Strictly complies with the 100-250 lines architectural rule
 */

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to update your avatar." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedUserId = (formData.get("userId") as string | null) || token.id;

    // Prevent IDOR: Customers can only update their own avatar
    if (token.role !== "admin" && requestedUserId !== token.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden. You cannot modify another user's avatar." },
        { status: 403 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Please provide an image file to upload." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid image format. Allowed formats: JPEG, PNG, WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Image exceeds 5MB size limit. Please upload a smaller file.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase image hosting storage
    const uploadResult = await ImageStorageService.uploadAvatar(
      requestedUserId,
      buffer,
      file.type
    );

    if (!uploadResult.success || !uploadResult.url) {
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;
      await UserDbService.updateAvatar(requestedUserId, dataUrl);

      return NextResponse.json(
        {
          success: true,
          url: dataUrl,
          message: "Profile avatar successfully updated in database.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: uploadResult.url,
        message: "Profile avatar successfully updated.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to process image upload request.";
    console.error("Avatar upload API error:", errorMsg);
    return NextResponse.json(
      { success: false, error: "Failed to process image upload request." },
      { status: 500 }
    );
  }
}
