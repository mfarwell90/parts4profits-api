export default async function handler(req, res) {
  if (req.method === 'GET') {
    const challenge = req.query.challenge_code;

    if (!challenge) {
      return res.status(400).json({ error: 'Missing challenge_code' });
    }

    // Respond exactly as eBay expects
    return res.status(200).json({
      challengeResponse: challenge,
    });
  }

  // Just in case they POST later
  res.status(405).end();
}
