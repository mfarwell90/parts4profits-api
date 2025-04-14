// Ensure Vercel parses the request body as JSON
export const config = {
  api: {
    bodyParser: true,
  },
};

import { createHash } from 'crypto';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export default async function handler(req, res) {
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  const endpointUrl = 'https://parts4profits.com/api/verify';

  // Handle eBay GET challenge
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

  // Handle actual eBay POST notifications
  if (req.method === 'POST') {
    try {
      console.log("🔔 Received POST from eBay:");
      console.log(JSON.stringify(req.body, null, 2));

      const event = req.body;

      const emailParams = new EmailParams()
        .setFrom(new Sender(process.env.ALERT_EMAIL, "Parts4Profits"))
        .setTo([new Recipient(process.env.ALERT_EMAIL, "Matthew")])
        .setSubject("🚨 eBay Marketplace Deletion Notification")
        .setText("Your API has successfully received a marketplace account deletion notification from eBay.");

      await mailerSend.email.send(emailParams);

      console.log("✅ Email sent successfully.");
      return res.status(200).json({ message: "Notification received and email sent." });
    } catch (error) {
      console.error("🔥 Error in POST handler:", error);
      return res.status(500).json({ error: "Failed to handle notification." });
    }
  }

  // Handle other methods
  return res.status(405).end(); // Method Not Allowed
}
