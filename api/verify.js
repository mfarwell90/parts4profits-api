export default async function handler(req, res) {
  if (req.method === 'GET') {
    const challenge = req.query.challenge_code;
    res.status(200).json({ challengeResponse: challenge });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}