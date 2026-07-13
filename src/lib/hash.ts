import { createHash, randomBytes } from "crypto";

export function createVisitorHash(ip: string, userAgent: string): string {
  const salt = process.env.HASH_SALT;
  return createHash("sha256")
    .update(`${ip}:${userAgent}:${salt}`)
    .digest("hex");
}

export function createGravatarHash(email: string): string {
  return createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

export function createUnsubscribeToken(): string {
  return randomBytes(32).toString("hex");
}
