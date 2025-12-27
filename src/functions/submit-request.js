// functions/api/submit-request.js
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // Validierung (simpel)
    if (!data.email || !data.start || !data.end) {
      return new Response("Fehlende Daten", { status: 400 });
    }

    // Email senden via Resend API
    // Du musst RESEND_API_KEY in den Cloudflare Dashboard Settings hinterlegen!
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "buchung@deine-domain.at", // Muss bei Resend verifiziert sein
        to: ["deine-private-mail@gmail.com"], // Hierhin geht die Anfrage
        subject: `Neue Anfrage: ${data.name}`,
        html: `
          <h1>Neue Buchungsanfrage</h1>
          <p><strong>Gast:</strong> ${data.name} (${data.email})</p>
          <p><strong>Zeitraum:</strong> ${data.start} bis ${data.end}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
        `,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response("Email Provider Error", { status: 500 });
    }

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}