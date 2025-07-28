export interface JobSummary {
  title: string;
  url: string;
  company: string;
}

export function extractJobInfoFromMarkdown(markdown: string): JobSummary | null {
  const titleMatch = markdown.match(/^#\s+(.+)/m) || markdown.match(/^###\s+(.+)/m);
  const urlMatch = markdown.match(/\[.*?\]\((https?:\/\/[^\)]+)\)/);

  if (!titleMatch || !urlMatch) return null;

  const title = titleMatch[1].trim();
  const url = urlMatch[1].trim();

  let company = 'Unknown';
  if (url.includes('barclays')) company = 'Barclays';
  else if (url.includes('kpmg')) company = 'KPMG';
  else if (url.includes('capgemini')) company = 'Capgemini';
  else if (url.includes('pwc')) company = 'PwC';

  return { title, url, company };
}
