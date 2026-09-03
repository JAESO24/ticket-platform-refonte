import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createClaimRecord, createEventRecord, createOrderRecord, findTicketByCode, listClaimsForUser, listOrdersForUser, listPublishedEvents, listTicketsForUser } from "./db";
import { TRPCError } from "@trpc/server";

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
    create: roleProcedure(["client"]).input(z.object({ items: z.array(z.object({ ticketTypeId: z.number().int().positive(), quantity: z.number().int().min(1).max(10), unitPrice: z.string() })).min(1), total: z.string().regex(/^\d+(\.\d{1,2})?$/) })).mutation(async ({ ctx, input }) => { const reference = `TF-${Date.now().toString(36).toUpperCase()}`; const result = await createOrderRecord({ userId: ctx.user.id, reference, total: input.total, status: "pending", paymentProvider: "pending" }); return { id: result[0].insertId, reference, status: "pending" as const }; }),
  }),
  claims: router({
    mine: protectedProcedure.query(({ ctx }) => listClaimsForUser(ctx.user.id)),
    create: protectedProcedure.input(z.object({ subject: z.string().min(3), message: z.string().min(10), orderId: z.number().optional() })).mutation(async ({ ctx, input }) => { const result = await createClaimRecord({ ...input, userId: ctx.user.id }); return { id: result[0].insertId, status: "open" as const }; }),
  }),
});
export type AppRouter = typeof appRouter;
