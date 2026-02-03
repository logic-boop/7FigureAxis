const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  // This uses the App Password you just generated
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "7figureaxis@gmail.com",
      pass: process.env.EMAIL_PASS, // We will set this on Vercel's dashboard
    },
  });

  try {
    await transporter.sendMail({
      from: `"7FIGURE AXIS SYSTEM" <7figureaxis@gmail.com>`,
      to: "7figureaxis@gmail.com",
      subject: `🚀 NEW LEAD: ${name} - ${subject}`,
      html: `
        <div style="background:#000; color:#fff; padding:30px; border:2px solid #d4af37; font-family:sans-serif;">
          <h2 style="color:#d4af37;">New 7Figure Axis Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border:0; border-top:1px solid #333; margin:20px 0;">
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail Error:", error);
    return res.status(500).json({ error: "Failed to send message." });
  }
}
