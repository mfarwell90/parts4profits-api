export default async function handler(req, res) {
  if (req.method === 'GET') {
    const challenge = req.query.challenge_code;
    const verificationToken = 'wrenchmasterparts4profitverification';

    // eBay sends this request to validate the endpoint
    if (!challenge) {
      return res.status(400).json({ error: 'Missing challenge_code' });
    }

    // Respond with the challenge as required by eBay
    return res.status(200).json({
      challengeResponse: challenge,
    });
  }

  res.status(405).end(); // Method Not Allowed
}
