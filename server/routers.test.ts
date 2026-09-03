import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = (role: "client" | "promoter" | "agent" | "admin"): TrpcContext => ({
  user: { id: 8, openId: "tester", name: "Test", email: "test@example.com", loginMethod: "test", role, phone: null, avatarUrl: null, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("business tRPC contracts", () => {
  it("returns a safe empty list when the public event catalogue has no database rows", async () => {
    const result = await appRouter.createCaller({ ...context("client"), user: null }).events.list();
    expect(result).toEqual([]);
  });

  it("rejects ticket checking for a client role", async () => {
    await expect(appRouter.createCaller(context("client")).tickets.check({ code: "TF-DEMO" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
