import fetch from 'node-fetch';
import fs from 'node:fs/promises';

const API_KEY = process.env.FIRECRAWL_API_KEY;
if (!API_KEY) {
  console.error('Missing FIRECRAWL_API_KEY');
  process.exit(1);
}

const query = 'graduate job UK site:search.jobs.barclays';

interface RawJob {
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
}

interface CleanJob {
  title: string;
  company: string;
  location?: string;
  url: string;
  summary?: string;
}

function cleanJob(raw: RawJob): CleanJob | null {
  if (!raw.title || !raw.url) return null;
  return {
    title: raw.title.trim(),
    company: 'Barclays',
    url: raw.url,
    summary: raw.snippet,
  };
}

async function main() {
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        maxResults: 20
      })
    });

    if (!res.ok) {
      throw new Error(`Firecrawl API returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const rawJobs: RawJob[] = data.results ?? [];
    const cleanJobs: CleanJob[] = rawJobs
      .map(cleanJob)
      .filter((job): job is CleanJob => !!job);

    await fs.writeFile('jobs.json', JSON.stringify(cleanJobs, null, 2));
    console.log(`Saved ${cleanJobs.length} Barclays jobs to jobs.json`);
  } catch (e) {
    console.error('Failed to fetch or clean jobs:', e);
    process.exit(1);
  }
}

main();
