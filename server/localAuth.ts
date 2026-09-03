import { randomBytes, scrypt as nodeScrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../drizzle/schema";

const scrypt = promisify(nodeScrypt);
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "ticketflow-local-secret");
export const LOCAL_AUTH_COOKIE = "ticketflow_local_session";

export async function hashPassword(password: string) { const salt = randomBytes(16); const derived = (await scrypt(password, salt, 64)) as Buffer; return `${salt.toString("hex")}:${derived.toString("hex")}`; }
export async function verifyPassword(password: string, stored: string) { const [saltHex, hashHex] = stored.split(":"); if (!saltHex || !hashHex) return false; const derived = (await scrypt(password, Buffer.from(saltHex, "hex"), 64)) as Buffer; const expected = Buffer.from(hashHex, "hex"); return expected.length === derived.length && timingSafeEqual(expected, derived); }
export async function createLocalSession(user: User) { return new SignJWT({ userId: user.id, role: user.role, isSuperAdmin: user.isSuperAdmin }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret); }
export async function getUserIdFromSession(token?: string) { if (!token) return null; try { const { payload } = await jwtVerify(token, secret); return typeof payload.userId === "number" ? payload.userId : Number(payload.userId) || null; } catch { return null; } }
export function hashResetToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function createResetToken() { return randomBytes(32).toString("hex"); }
