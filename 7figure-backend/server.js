const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Configure your email transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Shopifyguru0927@gmail.com", // Your email
      pass: "your-app-password", // Google App Password (not your login password)
    },
  });

  let mailOptions = {
    from: email,
    to: "Shopifyguru0927@gmail.com",
    subject: `7FIGURE INQUIRY: ${subject}`,
    text: `From: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send("Error");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
