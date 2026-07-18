import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });

export { cloudinary };

/**
 * Appends Cloudinary auto-format and quality transformations to a URL.
 * Converts: https://res.cloudinary.com/.../image.jpg
 * To:      https://res.cloudinary.com/.../image.jpg?f_auto,q_auto,w_<width>
 *
 * Only transforms Cloudinary URLs; returns other URLs unchanged.
 */
export function optimizeCloudinaryUrl(
  url: string,
  options?: { width?: number; quality?: number }
): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  const params = new URLSearchParams();
  params.set("f_auto", "auto");
  params.set("q_auto", "auto");
  if (options?.width) params.set("w", String(options.width));

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${params.toString()}`;
}
