import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const emailParams = new EmailParams()
        .setFrom(new Sender(process.env.MAIL_FROM_EMAIL, "Parts4Profits"))
        .setTo([new Recipient(process.env.MAIL_FROM_EMAIL, "Matthew")])
        .setSubject("🚨 eBay Account Deletion Notice Received")
        .setText("Your endpoint received an eBay account deletion notification.");

      await mailerSend.email.send(emailParams);

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email sending failed:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
