/**
 * emailService.ts
 *
 * Sends the admin purchase notification directly from the browser via EmailJS.
 * Zero backend involvement — all data is already available on the frontend.
 *
 * ─────────────────────────────────────────────
 * ONE-TIME SETUP (free at emailjs.com):
 * ─────────────────────────────────────────────
 * 1. Sign up at https://www.emailjs.com  (free = 200 emails/month)
 *
 * 2. Add an Email Service:
 *    Dashboard → Email Services → Add New Service
 *    Connect Gmail / Outlook / etc. → copy the Service ID
 *
 * 3. Create an Email Template:
 *    Dashboard → Email Templates → Create New Template
 *    · "To Email" field  →  {{to_email}}
 *    · "Subject" field   →  {{subject}}
 *    · Body (HTML mode)  →  {{{html_body}}}   ← triple braces = raw HTML
 *    Save → copy the Template ID
 *
 * 4. Get your Public Key:
 *    Dashboard → Account → General → Public Key
 *
 * 5. Install:
 *    npm install @emailjs/browser
 *
 * 6. Fill in the four constants below.
 * ─────────────────────────────────────────────
 */

import emailjs from "@emailjs/browser";
import type { CartItem } from "../context/CartContext";

// ── 🔧 Fill these in ──────────────────────────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
const ADMIN_EMAIL         = "admin@lila-deutsch.at";
// ─────────────────────────────────────────────

export type PurchaseEmailPayload = {
  studentName:  string;
  studentEmail: string;
  courses:      CartItem[];
};

export async function sendPurchaseNotificationEmail(
  payload: PurchaseEmailPayload
): Promise<void> {
  const { studentName, studentEmail, courses } = payload;
  const total = courses.reduce((sum, c) => sum + (c.price ?? 0), 0);

  const rows = courses
    .map(
      (c) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebff;">${c.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebff;text-align:center;">${c.level}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0ebff;text-align:right;">
          ${c.price !== null ? `€${c.price}` : "Preis auf Anfrage"}
        </td>
      </tr>`
    )
    .join("");

  const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">

  <div style="background:#6b21a8;border-radius:16px 16px 0 0;padding:24px 28px;">
    <h2 style="color:#fff;margin:0;font-size:20px;">Neue Kursbestellung</h2>
    <p style="color:rgba(255,255,255,0.65);margin:4px 0 0;font-size:13px;">
      Lila Deutsch Sprach Zentrum
    </p>
  </div>

  <div style="background:#fafafa;border:1px solid #ede9fe;border-top:none;
              border-radius:0 0 16px 16px;padding:24px 28px;">

    <h3 style="color:#6b21a8;margin:0 0 10px;font-size:12px;
               text-transform:uppercase;letter-spacing:0.08em;">Student</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="padding:5px 0;color:#6b7280;font-size:13px;width:100px;">Name</td>
        <td style="padding:5px 0;font-weight:700;font-size:13px;">${studentName}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#6b7280;font-size:13px;">E-Mail</td>
        <td style="padding:5px 0;font-weight:700;font-size:13px;">
          <a href="mailto:${studentEmail}" style="color:#6b21a8;">${studentEmail}</a>
        </td>
      </tr>
    </table>

    <h3 style="color:#6b21a8;margin:0 0 10px;font-size:12px;
               text-transform:uppercase;letter-spacing:0.08em;">Gewünschte Kurse</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead>
        <tr style="background:#ede9fe;">
          <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b21a8;">Kurs</th>
          <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b21a8;">Niveau</th>
          <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b21a8;">Preis</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      ${total > 0 ? `
      <tfoot>
        <tr>
          <td colspan="2" style="padding:10px 12px;font-weight:700;font-size:13px;">Gesamt</td>
          <td style="padding:10px 12px;font-weight:900;font-size:14px;
                     text-align:right;color:#6b21a8;">€${total.toFixed(2)}</td>
        </tr>
      </tfoot>` : ""}
    </table>

    <div style="background:#fef3c7;border:1px solid #fde68a;
                border-radius:10px;padding:12px 16px;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        <strong>Verwendungszweck:</strong> Der Student wurde gebeten,
        <strong>${studentEmail}</strong> bei der Überweisung als Referenz anzugeben.
        Bitte den Kurszugang nach Zahlungseingang freischalten.
      </p>
    </div>

    <p style="margin:20px 0 0;font-size:11px;color:#9ca3af;">
      Automatisch generiert · Lila Deutsch Kursbuchungssystem
    </p>
  </div>
</div>`;

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email:  ADMIN_EMAIL,
      subject:   `[Kursbestellung] ${studentName} – ${courses.length} Kurs(e)`,
      html_body: htmlBody,
    },
    EMAILJS_PUBLIC_KEY
  );
}