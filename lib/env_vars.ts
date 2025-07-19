export const env_vars = {
  THIRD_WEB_CLIENT_ID:
    process.env.THIRD_WEB_CLIENT_ID || process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID!,
  THIRD_WEB_SECRET_KEY:
    process.env.THIRD_WEB_SECRET_KEY || process.env.NEXT_PUBLIC_THIRD_WEB_SECRET_KEY!,
}
