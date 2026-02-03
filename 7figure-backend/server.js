const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // Protects your credentials

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // 1. Notification to YOU
  const adminMail = {
    from: `"7FIGURE AXIS SYSTEM" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🚀 NEW LEAD: ${name} - ${subject}`,
    html: `
      <div style="font-family: sans-serif; background: #000; color: #fff; padding: 30px; border: 2px solid #d4af37;">
        <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">New Inbound Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background: #111; padding: 15px; margin-top: 20px; border-left: 4px solid #d4af37;">
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      </div>
    `,
  };

  // 2. Auto-Responder to the CLIENT
  const clientMail = {
    from: `"7FIGURE AXIS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Initiating Connection | 7Figure Axis",
    html: `
      <div style="font-family: sans-serif; background: #fff; color: #000; padding: 30px;">
        <h1 style="letter-spacing: 5px;">7FIGURE AXIS</h1>
        <p>Hello ${name},</p>
        <p>Your inquiry has been received and encrypted. We are currently reviewing your goals and current revenue architecture.</p>
        <p><strong>While you wait:</strong> Check out the latest results in <a href="https://yourdomain.com/vault.html">The Vault</a>.</p>
        <br>
        <p>Success is a choice.</p>
        <p><em>— 7FigureAxis</em></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(clientMail); // Send the auto-reply
    res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
