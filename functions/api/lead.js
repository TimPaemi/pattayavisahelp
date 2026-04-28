/**
 * Cloudflare Pages Function — Lead Form Handler
 *
 * Endpoint: POST /api/lead
 *
 * Receives lead form submissions from the site, validates,
 * sends email via Resend, and returns JSON response.
 *
 * Setup required (one-time):
 * 1. Sign up at https://resend.com (free tier: 3,000 emails/month)
 * 2. Verify pattayavisahelp.com domain (Resend gives DNS records, paste in Cloudflare)
 * 3. Generate API key at https://resend.com/api-keys
 * 4. In Cloudflare Pages dashboard:
 *    Settings → Environment variables → Production
 *    Add: RESEND_API_KEY = re_xxxxxxxxxxxx
 *    Add: NOTIFICATION_EMAIL = timpaemi@gmail.com
 *    Add: SENDER_EMAIL = leads@pattayavisahelp.com
 * 5. Redeploy
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS / security headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://pattayavisahelp.com',
    'Cache-Control': 'no-store',
  };

  try {
    // Parse incoming JSON
    const data = await request.json();

    // Honeypot check — if 'website' field is filled, it's a bot
    if (data.website && data.website.length > 0) {
      // Silent success to bot
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // Verify Cloudflare Turnstile token (anti-spam)
    if (env.TURNSTILE_SECRET && data['cf-turnstile-response']) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET,
          response: data['cf-turnstile-response'],
          remoteip: request.headers.get('cf-connecting-ip')
        })
      });
      const verify = await verifyRes.json();
      if (!verify.success) {
        return new Response(JSON.stringify({ error: 'Spam check failed. Please try again.' }), { status: 403, headers });
      }
    }

    // Validate required fields
    if (!data.firstName || !data.email || !data.visaInterest) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Email format validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers }
      );
    }

    // Sanitize / cap field lengths
    const sanitize = (s, max = 500) => String(s || '').trim().slice(0, max);
    const lead = {
      firstName: sanitize(data.firstName, 100),
      lastName: sanitize(data.lastName, 100),
      email: sanitize(data.email, 200),
      phone: sanitize(data.phone, 50),
      visaInterest: sanitize(data.visaInterest, 50),
      situation: sanitize(data.situation, 2000),
      page: sanitize(data.page, 200),
      timestamp: data.timestamp || new Date().toISOString(),
      ipCountry: request.headers.get('cf-ipcountry') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Visa interest label mapping
    const visaLabels = {
      'not-sure': 'Not sure yet',
      'dtv': 'DTV',
      'retirement': 'Retirement (Non-O / O-A)',
      'privilege': 'Privilege / Elite',
      'ltr': 'LTR',
      'marriage': 'Marriage',
      'education': 'Education / Muay Thai',
      'business': 'Business / Work Permit',
      'smart': 'SMART',
      'tourist': 'Tourist',
      'other': 'Other',
    };
    const visaLabel = visaLabels[lead.visaInterest] || lead.visaInterest;

    // Compose internal notification email (to Tim)
    const internalSubject = `[NEW LEAD - ${visaLabel}] ${lead.firstName} ${lead.lastName} from ${lead.ipCountry}`;
    const internalHtml = `
      <div style="font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a;">
        <h2 style="font-size:20px;color:#0c4a6e;border-bottom:2px solid #0ea5e9;padding-bottom:8px;">New Lead — ${visaLabel}</h2>

        <div style="background:#f8fafc;padding:20px;border-radius:12px;margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${lead.email}" style="color:#0369a1;">${lead.email}</a></p>
          ${lead.phone ? `<p style="margin:0 0 8px;"><strong>Phone:</strong> ${lead.phone}</p>` : ''}
          <p style="margin:0 0 8px;"><strong>Visa interest:</strong> ${visaLabel}</p>
          <p style="margin:0 0 8px;"><strong>Country (by IP):</strong> ${lead.ipCountry}</p>
          <p style="margin:0;"><strong>Submitted:</strong> ${lead.timestamp}</p>
        </div>

        ${lead.situation ? `
          <div style="background:#fff;border:1px solid #e2e8f0;padding:20px;border-radius:12px;margin:16px 0;">
            <p style="margin:0 0 8px;font-weight:600;">Their situation:</p>
            <p style="margin:0;white-space:pre-wrap;">${lead.situation}</p>
          </div>
        ` : ''}

        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">
          <p style="margin:0 0 4px;">Page submitted from: ${lead.page}</p>
          <p style="margin:0;">User agent: ${lead.userAgent}</p>
        </div>

        <div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap;">
          <a href="mailto:${lead.email}?subject=Re:%20Your%20Thailand%20visa%20enquiry" style="background:#0c4a6e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Reply by email</a>
          ${lead.phone ? `<a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" style="background:#25d366;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Reply on WhatsApp</a>` : ''}
        </div>
      </div>
    `;

    // Compose auto-reply email (to lead)
    const autoReplySubject = `Thanks for getting in touch — Pattaya Visa Help`;
    const autoReplyHtml = `
      <div style="font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a;">
        <h2 style="font-size:24px;color:#0c4a6e;">Thanks, ${lead.firstName}.</h2>
        <p style="font-size:16px;line-height:1.6;">We've received your enquiry about <strong>${visaLabel}</strong>.</p>
        <p style="font-size:16px;line-height:1.6;">A real human will reply to you within <strong>24 hours</strong> with the right answer for your situation. No automated runaround, no chatbot — just a real reply from someone who knows the Thai visa system.</p>
        <p style="font-size:16px;line-height:1.6;">In the meantime, you may find these useful:</p>
        <ul style="font-size:16px;line-height:1.8;">
          <li><a href="https://pattayavisahelp.com/tools/visa-finder/" style="color:#0369a1;">Free visa-finder quiz — 5 questions, ranked match</a></li>
          <li><a href="https://pattayavisahelp.com/tools/cost-calculator/" style="color:#0369a1;">Real cost calculator for your visa choice</a></li>
          <li><a href="https://pattayavisahelp.com/compare/visa-comparison-matrix/" style="color:#0369a1;">Compare every Thailand visa side by side</a></li>
          <li><a href="https://pattayavisahelp.com/guides/visa-scams-pattaya/" style="color:#0369a1;">Visa scams to avoid in Pattaya</a></li>
          <li><a href="https://pattayavisahelp.com/guides/cost-of-living-pattaya/" style="color:#0369a1;">Pattaya cost of living 2026</a></li>
        </ul>
        <p style="font-size:16px;line-height:1.6;">If your situation is urgent, message us on WhatsApp for faster reply: <a href="https://wa.me/66967286999" style="color:#25d366;font-weight:600;">+66 96 728 6999</a>. Or reply directly to this email — it goes straight to our inbox.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
        <p style="font-size:14px;color:#64748b;">Pattaya Visa Help<br>Independent Thailand visa guidance from Pattaya<br><a href="https://pattayavisahelp.com" style="color:#0369a1;">pattayavisahelp.com</a></p>
      </div>
    `;

    // Send via Resend (only if API key configured)
    if (env.RESEND_API_KEY) {
      const senderEmail = env.SENDER_EMAIL || 'leads@pattayavisahelp.com';
      const notificationEmail = env.NOTIFICATION_EMAIL || 'info@pattayavisahelp.com';

      // Internal notification
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Pattaya Visa Help Leads <${senderEmail}>`,
          to: [notificationEmail],
          reply_to: lead.email,
          subject: internalSubject,
          html: internalHtml,
        }),
      });

      // Auto-reply (small delay to feel less automated)
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Pattaya Visa Help <${senderEmail}>`,
          to: [lead.email],
          subject: autoReplySubject,
          html: autoReplyHtml,
        }),
      });
    } else {
      // No API key configured yet — log to console (visible in Cloudflare dashboard)
      console.log('LEAD RECEIVED (Resend not configured):', JSON.stringify(lead, null, 2));
    }

    // Optional: store in Cloudflare KV for backup (if KV namespace bound)
    if (env.LEADS_KV) {
      const kvKey = `lead:${Date.now()}:${lead.email}`;
      await env.LEADS_KV.put(kvKey, JSON.stringify(lead), {
        expirationTtl: 60 * 60 * 24 * 365 * 2, // 2 years
      });
    }

    // Optional: instant Slack/Discord webhook notification
    // Set SLACK_WEBHOOK_URL o