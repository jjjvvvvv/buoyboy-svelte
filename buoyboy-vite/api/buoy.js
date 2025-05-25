// api/buoy.js

export default async function handler(req, res) {
  // For Vercel serverless functions (Node.js environment)
  const buoyId = req.query.buoyId;
  if (!buoyId) {
    res.status(400).send('Missing buoyId');
    return;
  }
  const ndbcUrl = `https://www.ndbc.noaa.gov/data/5day2/${buoyId}_5day.spec`;

  try {
    const response = await fetch(ndbcUrl);
    if (!response.ok) {
      res.status(response.status).send('NDBC error');
      return;
    }
    const data = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send('Failed to fetch buoy data');
  }
}