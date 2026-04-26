/**
 * Handles the POST request from the booking form
 * @param {Object} context - Cloudflare Pages context
 */
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // 1. Email to you (Admin)
    const adminEmail = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Use your verified domain as sender
        from: "Presshausgewölbe Anfrage <info@presshausgewoelbe.at>",
        to: "zimmerl.martin@gmail.com", 
        subject: `Neue Buchungsanfrage von ${data.name}`,
        html: `
          <h2>Neue Anfrage über die Website</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>E-Mail:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}</p>
          <p><strong>Zeitraum:</strong> ${data.start} bis ${data.end}</p>
          <p><strong>Nachricht:</strong><br>${data.message || 'Keine Nachricht hinterlassen'}</p>
        `
      })
    });

    // 2. Confirmation email to the Customer
    const customerEmail = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: "Ferienhaus Presshausgewölbe <info@presshausgewoelbe.at>",
        to: data.email,
        subject: "Ihre unverbindliche Anfrage - Ferienhaus Presshausgewölbe",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Guten Tag ${data.name},</h2>
            <p>vielen Dank für Ihr Interesse an unserem Ferienhaus Presshausgewölbe!</p>
            <p>Wir haben Ihre unverbindliche Anfrage für den Zeitraum vom <strong>${data.start} bis ${data.end}</strong> erhalten.</p>
            <p>Wir prüfen nun die Verfügbarkeit und melden uns in Kürze persönlich bei Ihnen, um alles Weitere zu besprechen.</p>
            <br>
            <p>Herzliche Grüße aus dem Weinviertel,<br>
            <strong>Ihre Familie Zimmerl</strong></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">Dies ist eine automatisch generierte Bestätigung Ihrer Anfrage über presshausgewoelbe.at.</p>
          </div>
        `
      })
    });

    // Send both emails simultaneously
    const [adminRes, customerRes] = await Promise.all([adminEmail, customerEmail]);

    if (adminRes.ok && customerRes.ok) {
      return new Response(JSON.stringify({ message: "Emails sent successfully" }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const error = await adminRes.text();
      return new Response(JSON.stringify({ error: "Resend API error", details: error }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: "Server Error", message: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}