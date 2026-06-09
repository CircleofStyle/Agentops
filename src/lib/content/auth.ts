export function isPipelineAuthorized(authHeader: string | null): boolean {
  const secret = process.env.CONTENT_PIPELINE_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";

  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === secret;
}
