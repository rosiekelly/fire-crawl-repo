import fetch from 'node-fetch';
import { extractJobInfoFromMarkdown } from './cleanJobs';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

async function firecrawlSearch(query: string) {
  const response = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      location: "London, England, United Kingdom",
      num_results: 10,
      extract_text: true,
      markdown: true,
      links: true
    })
  });

  const data = await response.json();
  return data.results.map((r: any) => r.markdown);
}

(async () => {
  const markdownResults = await firecrawlSearch('graduate business analyst site:.uk');

  const cleanedJobs = markdownResults
    .map(md => extractJobInfoFromMarkdown(md))
    .filter((j): j is NonNullable<typeof j> => j !== null);

  console.log('🎓 Cleaned Jobs:', cleanedJobs);
})();
