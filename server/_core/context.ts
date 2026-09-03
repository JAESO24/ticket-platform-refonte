import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getUserById } from "../db";
import { getUserIdFromSession, LOCAL_AUTH_COOKIE } from "../localAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    const rawCookie = opts.req.headers.cookie ?? "";
    const token = rawCookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${LOCAL_AUTH_COOKIE}=`))?.split("=").slice(1).join("=");
    const localUserId = await getUserIdFromSession(token);
    user = localUserId ? (await getUserById(localUserId)) ?? null : null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
