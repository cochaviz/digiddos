import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Article } from '$lib/services/news';

const MIN_CHECK_INTERVAL = 60000; // 1 minute in milliseconds
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// In-memory storage for last check time and response
let lastCheckTime = 0;
let lastResponse: any = null;

type NewsSource = {
    name: string;
    fetch: (query: string) => Promise<Article[]>;
}

const NEWS_SOURCES: NewsSource[] = [
    { name: 'NOS', fetch: getNosArticles },
];

export const GET: RequestHandler = async ({ url }) => {
    const currentTime = Date.now();
    const oneMonthAgo = new Date(currentTime - ONE_MONTH_MS);

    // Check if enough time has passed since the last check
    if (lastResponse && currentTime - lastCheckTime < MIN_CHECK_INTERVAL) {
        // Return the last stored response without making a new request
        return json(lastResponse);
    }

    const articles: Article[] = [];

    try {
        for (const source of NEWS_SOURCES) {
            const sourceArticles = await source.fetch('digid');
            // Filter articles from the last month
            const recentArticles = sourceArticles.filter(article => {
                const articleDate = new Date(article.publishedAt);
                return articleDate >= oneMonthAgo;
            });
            articles.push(...recentArticles);
        }

        const result = { articles: articles, summaries: [] };

        // Update last check time and store the response
        lastCheckTime = currentTime;
        lastResponse = result;

        return json(result);
    } catch (error) {
        console.error('Error fetching news:', error);
        return json({ articles: [], summaries: [] });
    }
};

async function getNosArticles(query: string): Promise<Article[]> {
    const url = `https://nos.nl/api/search?q=${query}&page=1`;
    const response = await fetch(url);
    const data = await response.json();

    return data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        url: `https://nos.nl/artikel/${item.id}`,
        source: 'NOS',
        publishedAt: item.publishedAt
    }));
}
