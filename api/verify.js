import { createHash } from 'crypto';

export const config = {
  api: {
    bodyParser: true,
  },
};

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
    return res.status(200).json({ challengeResponse });
  }

  if (req.method === 'POST') {
    console.log("🔔 Received POST from eBay:");
    console.log(JSON.stringify(req.body, null, 2));

    // Optional: Try to send an alert if MailerSend is available
    try {
      const { MailerSend, EmailParams, Sender, Recipient } = await import('mailersend');

      if (process.env.MAILERSEND_API_KEY && process.env.ALERT_EMAIL) {
        const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });

        const emailParams = new EmailParams()
          .setFrom(new Sender(process.env.ALERT_EMAIL, "Parts4Profits"))
          .setTo([new Recipient(process.env.ALERT_EMAIL, "Matthew")])
          .setSubject("🚨 eBay Marketplace Deletion Notification")
          .setText("A deletion notification was received.\n\n" + JSON.stringify(req.body, null, 2));

        await mailerSend.email.send(emailParams);
        console.log("✅ Email sent.");
      } else {
        console.warn("⚠️ MailerSend credentials missing, skipping email alert.");
      }
    } catch (e) {
      console.error("📭 Failed to send alert email:", e.message || e);
    }

    return res.status(200).json({ message: "Logged successfully." });
  }

  return res.status(405).end(); // Method Not Allowed
}
