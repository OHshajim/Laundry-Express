/**
 * Laundry Express - Image Compressor Utility
 *
 * Lightweight, client-side HTML Canvas image compression.
 * Automatically resizes high-resolution camera uploads (up to 5MB)
 * down to crisp, web-optimized WebP/JPEG files (< 250KB) before uploading.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: "image/webp" | "image/jpeg" | "image/png";
}

/**
 * Compresses an image file in the browser before network transmission.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    mimeType = "image/webp",
  } = options;

  // Return original file if running on server or if SVG
  if (typeof window === "undefined" || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Maintain aspect ratio while scaling to max dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If compression didn't reduce size, fallback to original
          if (blob.size >= file.size && file.type.startsWith("image/")) {
            resolve(file);
            return;
          }

          const fileExt = mimeType === "image/webp" ? "webp" : "jpg";
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const compressedFile = new File([blob], `${baseName}.${fileExt}`, {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
