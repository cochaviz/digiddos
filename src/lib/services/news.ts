export type Article = {
    id: string;
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: Date;
}


// Fetch news articles from specified sources
export async function fetchNewsArticles(limit: number = 3): Promise<Article[]> {
    try {
        const response = await fetch(`/api/news`);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news articles:', error);
        return [];
    }
}