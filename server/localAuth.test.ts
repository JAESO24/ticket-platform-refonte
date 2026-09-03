import { describe, expect, it } from "vitest";
import { createLocalSession, getUserIdFromSession, hashPassword, verifyPassword } from "./localAuth";
import type { User } from "../drizzle/schema";

const user = { id: 42, openId: "local_test", name: "Test", email: "test@example.com", loginMethod: "local", role: "admin", passwordHash: null, status: "actif", profileId: null, isSuperAdmin: true, resetTokenHash: null, resetExpiresAt: null, phone: null, avatarUrl: null, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } as User;

describe("local authentication", () => {
  it("hashes passwords and rejects incorrect passwords", async () => { const hash = await hashPassword("CorrectHorseBatteryStaple"); expect(hash).not.toContain("CorrectHorse"); await expect(verifyPassword("CorrectHorseBatteryStaple", hash)).resolves.toBe(true); await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false); });
  it("creates a signed session that resolves to the user id", async () => { const token = await createLocalSession(user); await expect(getUserIdFromSession(token)).resolves.toBe(42); await expect(getUserIdFromSession(`${token}invalid`)).resolves.toBeNull(); });
});
