import crypto from 'crypto';

const VERIFICATION_TOKEN = 'wrenchmasterparts4profitsverification';
const ENDPOINT = 'https://parts4profits.com/api/verify';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const challenge = req.query.challenge_code;

    // Create SHA-256 hash: challengeCode + verificationToken + endpoint
    const hash = crypto.createHash('sha256');
    hash.update(challenge);
    hash.update(VERIFICATION_TOKEN);
    hash.update(ENDPOINT);
    const challengeResponse = hash.digest('hex');

    res.status(200).json({ challengeResponse });
  }

  else if (req.method === 'POST') {
    // Log or process the actual notification eBay sends (for testing now, just log)
    console.log('📩 POST Notification from eBay:', req.body);

    res.status(200).json({ received: true });
  }

  else {
    res.status(405).end(); // Method Not Allowed
  }
}
