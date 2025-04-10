export default async function handler(req, res) {
  if (req.method === 'GET') {
    // eBay verification challenge
    const challenge = req.query.challenge_code;
    const verificationToken = 'wrenchmaster-3vX8T9pKg7a6Q2LmCz1RbDYeZoUv';

    res.status(200).json({
      challengeResponse: challenge
    });
  } else if (req.method === 'POST') {
    // Marketplace deletion notification received
    const event = req.body;

    console.log('Received Marketplace Deletion Event:', event);

    res.status(200).end(); // Acknowledge receipt
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
