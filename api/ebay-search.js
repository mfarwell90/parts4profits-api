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
  const sort = req.query.sort || 'recent';

  const response = await fetch(`${EBAY_ENDPOINT}?q=${encodeURIComponent(query)}&limit=50`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const apiData = await response.json();

  // Filter results
  const filtered = (apiData.itemSummaries || []).filter(item =>
    item.image?.imageUrl &&
    item.condition === 'USED' &&
    item.itemLocation?.country === 'US' &&
    item.sellingStatus?.sold === true
  );

  // Sort results
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price') return b.price.value - a.price.value;
    return new Date(b.listingDate || 0) - new Date(a.listingDate || 0); // sort=recent is default
  });

  res.status(200).json(sorted);
}
