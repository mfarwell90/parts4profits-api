export default async function handler(req, res) {
  if (req.method === 'GET') {
    const challenge = req.query.challenge_code;
    const verificationToken = 'wrenchmasterparts4profitsverification';
    const endpoint = 'https://parts4profits.com/api/verify';
    const crypto = await import('crypto');

    const hash = crypto.createHash('sha256');
    hash.update(challenge);
    hash.update(verificationToken);
    hash.update(endpoint);
    const responseHash = hash.digest('hex');

    res.status(200).json({ challengeResponse: responseHash });
  } else if (req.method === 'POST') {
    console.log('📩 eBay Deletion Notice Received:', req.body);

    // Optional: save this info somewhere
    res.status(200).json({ success: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
