import { Resend } from 'resend';

// Accessing environment variables in Node.js
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!resend) {
        console.error("RESEND_API_KEY is missing in environment variables");
        return res.status(500).json({ error: "Server Configuration Error: Missing API key." });
    }

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Missing required fields: name, email, or message." });
        }

        const data = await resend.emails.send({
            from: 'Artisanal <onboarding@resend.dev>',
            to: 'kcsapovadia@gmail.com',
            subject: `New Contact Message from ${name}`,
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #dac464; border-bottom: 2px solid #dac464; padding-bottom: 10px;">New Inquiry: ${name}</h2>
                    <p style="margin-top: 20px;"><strong>From:</strong> ${name} (${email})</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                        This email was sent from the Artisanal Restaurant contact form.
                    </p>
                </div>
            `
        });

        if (data.error) {
            console.error("Resend API error:", data.error);
            return res.status(400).json({ error: data.error.message });
        }

        return res.status(200).json({ success: true, data: data.data });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
