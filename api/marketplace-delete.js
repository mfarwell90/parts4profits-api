export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;

    console.log("📩 Marketplace Deletion Notification Received:", body);

    // Always respond 200 OK
    res.status(200).json({ received: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
