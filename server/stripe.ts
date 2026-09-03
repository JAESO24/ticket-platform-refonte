import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2026-08-26.dahlia" });

export async function createTicketCheckout(input: { userId: number; email?: string | null; name?: string | null; origin: string; reference: string; items: Array<{ name: string; quantity: number; unitPrice: number }> }) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe n’est pas configuré");
  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email ?? undefined,
    client_reference_id: String(input.userId),
    metadata: { user_id: String(input.userId), customer_email: input.email ?? "", customer_name: input.name ?? "", order_reference: input.reference },
    allow_promotion_codes: true,
    line_items: input.items.map((item) => ({ price_data: { currency: "xof", product_data: { name: item.name }, unit_amount: Math.round(item.unitPrice), }, quantity: item.quantity })),
    success_url: `${input.origin}/espace-client?payment=success&reference=${input.reference}`,
    cancel_url: `${input.origin}/?payment=cancelled&reference=${input.reference}`,
  });
}
