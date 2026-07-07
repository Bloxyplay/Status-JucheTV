export default async function handler(req, res) {
  // 1. Extract query parameters (e.g., date=2026-07-07)
  const queryString = new URLSearchParams(req.query).toString();
  
  // 2. Construct the target URL
  const targetUrl = `https://koryofront.org/api/kctv/epg?${queryString}`;

  try {
    // 3. Fetch data from the remote API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel Serverless Proxy',
        'Accept': 'application/json'
      }
    });

    // 4. Handle non-200 responses from the source
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch from upstream API: ${response.statusText}`
      });
    }

    // 5. Parse the JSON payload
    const data = await response.json();

    // 6. Set CORS headers so your frontend/app can access it seamlessly
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    // 7. Return the data
    return res.status(200).json(data);

  } catch (error) {
    // Handle network or unexpected runtime errors
    return res.status(500).json({ error: error.message });
  }
}
