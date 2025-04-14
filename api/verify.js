import { createHash } from 'crypto';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export default async function handler(req, res) {
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  const endpointUrl = 'https://parts4profits.com/api/verify';

  if (req.method === 'GET') {
    const challengeCode = req.query.challenge_code;

    const hash = createHash('sha256');
    hash.update(challengeCode);
    hash.update(verificationToken);
    hash.update(endpointUrl);

    const challengeResponse = hash.digest('hex');

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ challengeResponse });
  }

  if (req.method === 'POST') {
    try {
      const emailParams = new EmailParams()
        .setFrom(new Sender(process.env.MAIL_FROM_EMAIL, "Parts4Profits"))
        .setTo([new Recipient(process.env.MAIL_FROM_EMAIL, "Matthew")])
        .setSubject("🚨 eBay Marketplace Deletion Notice Received")
        .setText("Your API has successfully received a marketplace account deletion notification from eBay.");

      await mailerSend.email.send(emailParams);

      return res.status(200).json({ message: "Notification received and email sent." });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
