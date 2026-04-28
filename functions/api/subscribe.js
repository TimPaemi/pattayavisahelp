/**
 * Cloudflare Pages Function — Newsletter Subscribe
 *
 * Endpoint: POST /api/subscribe
 *
 * Adds an email to the SUBSCRIBERS_KV namespace and optionally
 * triggers a welcome email via Resend.
 *
 * Setup required:
 * 1. In Cloudflare Pages dashboard → Settings → Functions → KV Namespace bindings:
 *    Variable: SUBSCRIBERS_KV
 *    Namespace: [create new "pvh-subscribers"]
 * 2. Optional: set RESEND_API_KEY env var for welcome emails
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://pattayavisahelp.com',
    'Cache-Control': 'no-store',
  };

  try {
    const data = await request.json();

    // Honeypot check
    if (data.website && data.website.length > 0) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    // Verify Cloudflare Turnstile token (optional)
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
        return new Response(JSON.stringify({ error: 'Spam check failed.' }), { status: 403, headers });
      }
    }

    // Validate email
    const email = String(data.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address.' }),
        { status: 400, headers }
      );
    }

    const subscriber = {
      email,
      timestamp: new Date().toISOString(),
      ipCountry: request.headers.get('cf-ipcountry') || 'unknown',
      source: data.source || 'unknown',
    };

    // Store in KV
    if (env.SUBSCRIBERS_KV) {
      const existingRaw = await env.SUBSCRIBERS_KV.get(`sub:${email}`);
      if (existingRaw) {
        // Already subscribed
        return new Response(
          JSON.stringify({ success: true, message: 'Already subscribed. Thanks!' }),
          { status: 200, headers }
        );
      }
      await env.SUBSCRIBERS_KV.put(`sub:${email}`, JSON.stringify(subscriber));
    }

    // Send welcome email via Resend
    if (env.RESEND_API_KEY) {
      const senderEmail = env.SENDER_EMAIL || 'leads@pattayavisahelp.com';
      const welcomeHtml = `
        <div style="font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a;">
          <h2 style="font-size:24px;color:#0c4a6e;">Welcome to Pattaya Visa Help.</h2>
          <p style="font-size:16px;line-height:1.6;">You're now subscribed to our Thailand visa news updates.</p>
          <p style="font-size:16px;line-height:1.6;">We send updates only when something changes — Royal Gazette announcements, Cabinet rulings, BOI updates, immigration practice changes. Typically once or twice a month, never spam.</p>
          <p style="font-size:16px;line-height:1.6;">In the meantime, here are a few things you may find useful:</p>
          <ul style="font-size:16px;line-height:1.8;">
            <li><a href="https://pattayavisahelp.com/tools/visa-finder/" style="color:#0369a1;">Free visa-finder quiz</a></li>
            <li><a href="https://pattayavisahelp.com/tools/cost-calculator/" style="color:#0369a1;">Cost calculator</a></li>
            <li><a href="https://pattayavisahelp.com/blog/2026-thailand-visa-changes-recap/" style="color:#0369a1;">2026 visa changes recap</a></li>
          </ul>
          <p style="font-size:16px;line-height:1.6;">Free 15-minute consultations are always open: <a href="https://pattayavisahelp.com/#consultation" style="color:#0369a1;">book here</a> or WhatsApp <a href="https://wa.me/66967286999" style="color:#25d366;">+66 96 728 6999</a>.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
          <p style="font-size:13px;color:#64748b;">Pattaya Visa Help · Independent Thailand visa guidance from Pattaya · <a href="https://pattayavisahelp.com" style="color:#0369a1;">pattayavisahelp.com</a></p>
          <p style="font-size:11px;color:#94a3b8;">To unsubscribe, reply to this email with "unsubscribe" in the subject.</p>
        </div>
      `;

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `Pattaya Visa Help <${senderEmail}>`,
            to: [email],
            subject: 'Welcome to Pattaya Visa Help news',
            html: welcomeHtml,
          }),
        });
      } catch (e) {
        console.error('Welcome email failed:', e);
      }
    }

    // Optional: Slack/Discord webhook
    if (env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `:envelope: New subscriber: *${email}* (${subscriber.ipCountry}) from ${subscriber.source}`
          }),
        });
      } catch (e) { console.error('Slack failed:', e); }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscribed. Check your inbox.' }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error('Subscribe handler error:', err);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again.' }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://pattayavisahelp.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
