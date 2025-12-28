/**
 * Handles the POST request from the booking form
 * @param {Object} context - Cloudflare Pages context
 */
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // Basic Validation
    if (!data.name || !data.email || !data.start) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Call Resend API to send the email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Anfrage <onboarding@resend.dev>", // Change this once you verified your own domain
        to: ["zimart.martin@gmail.com"], // <--- REPLACE THIS WITH YOUR EMAIL
        subject: `Neue Anfrage Presshaus: ${data.name}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #8c9c4c;">Neue Buchungsanfrage</h2>
            <p><strong>Gast:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone || '-'}</p>
            <hr>
            <p><strong>Zeitraum:</strong> ${data.start} bis ${data.end}</p>
            <p><strong>Hinweis:</strong> Bitte antworte dem Gast direkt via Email.</p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      const errorText = await res.text();
      return new Response(JSON.stringify({ error: errorText }), { status: 500 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}