import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "../config/env.js";

export type OrderMailSnapshot = {
  orderNumber: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.MAIL_HOST) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_PORT === 465,
    auth:
      env.MAIL_USER && env.MAIL_PASS
        ? { user: env.MAIL_USER, pass: env.MAIL_PASS }
        : undefined,
  });
  return transporter;
}

export async function sendOrderConfirmation(
  order: OrderMailSnapshot,
): Promise<void> {
  const lines = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px 6px 0">${i.name}</td><td style="padding:6px 12px">× ${i.quantity}</td><td style="padding:6px 0;text-align:right">$${(
          i.price * i.quantity
        ).toFixed(2)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#0a0a0a">
      <p style="font-size:26px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px">Maison Cleo</p>
      <p style="margin:0 0 24px;color:#666;font-size:13px">Nashville, TN</p>
      <p>Thank you for your order. A copy is below — we'll email you again the moment it ships.</p>
      <p style="margin:18px 0 6px;font-size:12px;letter-spacing:1px;text-transform:uppercase">Order ${order.orderNumber}</p>
      <table style="width:100%;border-top:1px solid #e8dcc8;border-bottom:1px solid #e8dcc8">${lines}
        <tr><td colspan="2" style="padding:10px 0;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold">$${order.total.toFixed(2)}</td></tr>
      </table>
      <p style="margin-top:24px;font-size:13px;color:#666">Need anything? Reply to this email or call (615) 555-0134.</p>
    </div>`;

  const t = getTransporter();
  if (!t) {
    console.log(
      `[mail] would send order confirmation ${order.orderNumber} to ${order.email}\n---\n${html}`,
    );
    return;
  }
  await t.sendMail({
    from: env.MAIL_FROM,
    to: order.email,
    subject: `Your Maison Cleo order ${order.orderNumber}`,
    html,
  });
}