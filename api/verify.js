export default function handler(req, res) {
  const VERIFY_TOKEN = 'wrenchmaster-3vX8T9pKg7a6Q2LmCz1RbDYeZoUv';

  if (req.method === 'GET') {
    const token = req.query.verification_token;

    if (token === VERIFY_TOKEN) {
      res.status(200).send(token);
    } else {
      res.status(403).send('Forbidden');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
