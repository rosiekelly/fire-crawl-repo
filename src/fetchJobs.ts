import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = process.env.FIRECRAWL_API_KEY;

const query = 'graduate job UK site:capgemini.com';

async function main() {
  const res = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      maxResults: 10
    })
  });

  const data = await res.json();
  fs.writeFileSync('jobs.json', JSON.stringify(data, null, 2));
  console.log('Saved search results to jobs.json');
}

main();
