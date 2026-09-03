import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createClaimRecord, createEventRecord, createOrderRecord, findTicketByCode, listClaimsForUser, listOrdersForUser, listPublishedEvents, listTicketsForUser, getDb } from "./db";
import { campaigns, promoterRequests, votes, withdrawals } from "../drizzle/schema";
import { createTicketCheckout } from "./stripe";

const eventInput = z.object({ title: z.string().min(3), description: z.string().min(10), category: z.string().min(2), venue: z.string().min(2), city: z.string().default("Abidjan"), eventDate: z.coerce.date(), coverUrl: z.string().optional() });
const roleProcedure = (roles: Array<"client" | "promoter" | "agent" | "admin">) => protectedProcedure.use(({ ctx, next }) => { if (!roles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Accès non autorisé pour ce rôle." }); return next({ ctx }); });

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  events: router({
    list: publicProcedure.input(z.object({ search: z.string().optional(), category: z.string().optional() }).optional()).query(async ({ input }) => { const rows = await listPublishedEvents(); const search = input?.search?.toLowerCase(); return rows.filter((event) => (!search || `${event.title} ${event.venue} ${event.category}`.toLowerCase().includes(search)) && (!input?.category || event.category === input.category)); }),
    create: roleProcedure(["promoter", "admin"]).input(eventInput).mutation(async ({ ctx, input }) => { const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`; const result = await createEventRecord({ ...input, slug, promoterId: ctx.user.id, status: "pending" }); return { id: result[0].insertId, slug }; }),
  }),
  tickets: router({
    mine: roleProcedure(["client", "promoter", "admin"]).query(({ ctx }) => listTicketsForUser(ctx.user.id)),
    check: roleProcedure(["agent", "admin"]).input(z.object({ code: z.string().min(4) })).mutation(async ({ input }) => { const found = await findTicketByCode(input.code); if (!found) return { valid: false, reason: "Billet introuvable" as const }; if (found.status !== "valid") return { valid: false, reason: "Billet déjà utilisé ou annulé" as const }; return { valid: true, ticket: found }; }),
  }),
  orders: router({
    mine: roleProcedure(["client", "admin"]).query(({ ctx }) => listOrdersForUser(ctx.user.id)),
    create: roleProcedure(["client"]).input(z.object({ items: z.array(z.object({ ticketTypeId: z.number().int().positive(), quantity: z.number().int().min(1).max(10), unitPrice: z.string() })).min(1), total: z.string().regex(/^\d+(\.\d{1,2})?$/) })).mutation(async ({ ctx, input }) => { const reference = `TF-${Date.now().toString(36).toUpperCase()}`; const result = await createOrderRecord({ userId: ctx.user.id, reference, total: input.total, status: "pending", paymentProvider: "stripe" }); return { id: result[0].insertId, reference, status: "pending" as const }; }),
    checkout: roleProcedure(["client"]).input(z.object({ reference: z.string(), items: z.array(z.object({ name: z.string(), quantity: z.number().int().min(1), unitPrice: z.number().positive() })).min(1) })).mutation(async ({ ctx, input }) => { const session = await createTicketCheckout({ userId: ctx.user.id, email: ctx.user.email, name: ctx.user.name, origin: ctx.req.headers.origin ?? "http://localhost:3000", reference: input.reference, items: input.items }); return { checkoutUrl: session.url }; }),
  }),
  promoter: router({
    campaigns: roleProcedure(["promoter", "admin"]).query(async () => { const db = await getDb(); return db ? db.select().from(campaigns) : []; }),
    withdrawals: roleProcedure(["promoter", "admin"]).query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(withdrawals).where(eq(withdrawals.promoterId, ctx.user.id)) : []; }),
    eligibility: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(promoterRequests).where(eq(promoterRequests.userId, ctx.user.id)) : []; }),
  }),
  votes: router({
    forEvent: publicProcedure.input(z.object({ eventId: z.number().int().positive() })).query(async ({ input }) => { const db = await getDb(); return db ? db.select().from(votes).where(eq(votes.eventId, input.eventId)) : []; }),
    create: protectedProcedure.input(z.object({ eventId: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(votes).values({ eventId: input.eventId, userId: ctx.user.id }); return { success: true as const }; }),
  }),
  claims: router({
    mine: protectedProcedure.query(({ ctx }) => listClaimsForUser(ctx.user.id)),
    create: protectedProcedure.input(z.object({ subject: z.string().min(3), message: z.string().min(10), orderId: z.number().optional() })).mutation(async ({ ctx, input }) => { const result = await createClaimRecord({ ...input, userId: ctx.user.id }); return { id: result[0].insertId, status: "open" as const }; }),
  }),
});
export type AppRouter = typeof appRouter;
