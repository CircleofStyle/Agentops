function bearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

/** Pipeline routes accept agent secret or Vercel cron secret (CRON_SECRET). */
export function isPipelineAuthorized(authHeader: string | null): boolean {
  const token = bearerToken(authHeader);
  if (!token) return process.env.NODE_ENV !== "production" && !process.env.CONTENT_PIPELINE_SECRET;

  const secrets = [process.env.CONTENT_PIPELINE_SECRET, process.env.CRON_SECRET].filter(
    (value): value is string => Boolean(value),
  );

  if (secrets.length === 0) return process.env.NODE_ENV !== "production";

  return secrets.includes(token);
}
