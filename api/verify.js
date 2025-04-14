import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const challengeCode = req.query.challenge_code;

    // These must be hardcoded or stored as env vars
    const verificationToken = 'wrenchmasterparts4profitsverification';
    const endpoint = 'https://parts4profits.com/api/verify';

    // Hash in the correct order
    const hash = crypto.createHash('sha256');
    hash.update(challengeCode);
    hash.update(verificationToken);
    hash.update(endpoint);

    const challengeResponse = hash.digest('hex');

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ challengeResponse });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}