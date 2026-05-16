import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendOrderStatusEmail({
  to,
  customerName,
  orderNumber,
  newStatus,
  clientUrl = process.env.CLIENT_URL || 'https://capzyy.com',
}) {
  const subjects = {
    shipped:   `Your Capzyy order ${orderNumber} has been shipped! 🚚`,
    delivered: `Your Capzyy order ${orderNumber} has been delivered! 🎉`,
    rejected:  `Update on your Capzyy order ${orderNumber}`,
  };

  const bodies = {
    shipped: `
      <p>Hi ${customerName},</p>
      <p>Great news! Your order <strong>${orderNumber}</strong> is on its way.</p>
      <p>You will receive it within 3–7 business days. We'll keep you updated.</p>
      <p>If you have any questions, reach us on Instagram <a href="https://instagram.com/capzyy">@capzyy</a>.</p>
    `,
    delivered: `
      <p>Hi ${customerName},</p>
      <p>Your order <strong>${orderNumber}</strong> has been delivered. We hope you love your new cap! 🧢</p>
      <p>Tag us <a href="https://instagram.com/capzyy">@capzyy</a> on Instagram — we'd love to see it!</p>
      <p>Thank you for shopping with Capzyy!</p>
    `,
    rejected: `
      <p>Hi ${customerName},</p>
      <p>We're sorry — your order <strong>${orderNumber}</strong> could not be fulfilled.</p>
      <p>If payment was collected, a full refund will be processed within 5–7 business days.</p>
      <p>Feel free to <a href="${clientUrl}/contact">contact us</a> if you have any questions.</p>
    `,
  };

  const subject  = subjects[newStatus];
  const bodyHtml = bodies[newStatus];

  if (!subject) return; // unknown status, skip silently

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #141414; border: 1px solid #2a2a2a; padding: 40px; }
        .logo { font-size: 28px; font-weight: bold; letter-spacing: 0.2em; color: #ffffff; margin-bottom: 32px; }
        .order-badge { display: inline-block; background: #1e1e1e; border: 1px solid #2a2a2a; color: #ffffff; padding: 8px 16px; font-family: monospace; font-size: 14px; margin: 16px 0; }
        p { line-height: 1.7; color: #b0b0b0; }
        a { color: #ffffff; }
        .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #2a2a2a; font-size: 12px; color: #555; }
        .cta { display: inline-block; margin-top: 24px; padding: 12px 32px; background: #ffffff; color: #000000; text-decoration: none; font-weight: bold; letter-spacing: 0.1em; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">CAPZYY</div>
        ${bodyHtml}
        <div class="order-badge">${orderNumber}</div>
        <br/>
        <a href="${clientUrl}/shop" class="cta">SHOP MORE</a>
        <div class="footer">
          © ${new Date().getFullYear()} Capzyy. All rights reserved.<br/>
          You received this email because you placed an order on capzyy.com.
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `"Capzyy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}