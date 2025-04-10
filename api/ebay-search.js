export default async function handler(req, res) {
  const { EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_SCOPE, EBAY_ENDPOINT } = process.env;

  // Get token
  const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&scope=${EBAY_SCOPE}`,
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Make eBay API call
  const query = req.query.q || 'honda civic radio';
  const response = await fetch(`${EBAY_ENDPOINT}?q=${encodeURIComponent(query)}&limit=10`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  res.status(200).json(data);
}
