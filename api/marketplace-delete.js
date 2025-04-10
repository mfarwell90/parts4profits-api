export default async function handler(req, res) {
if (req.method === 'GET') {
  const challenge = req.query.challenge_code;
  const verificationToken = 'wrenchmasterparts4profitverification';

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
