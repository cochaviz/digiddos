import axios from 'axios';

// Type definitions
export interface BlueskyPost {
    id: string;
    author: string;
    authorHandle: string;
    content: string;
    createdAt: string;
    avatar: string;
}

export interface WordFrequency {
    word: string;
    count: number;
    weight: number; // For visualization sizing
}

// Function to fetch posts from Bluesky
export async function fetchSocialPosts(): Promise<BlueskyPost[]> {
    try {
        const response = await axios.get('/api/social');
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching Bluesky posts:', error);
        return [];
    }
}

// Function to analyze post content and extract word frequency
export function analyzeWordFrequency(posts: BlueskyPost[]): WordFrequency[] {
    // Combine all post content
    const allText = posts.map(post => post.content).join(' ');

    // Split into words, convert to lowercase, and remove special characters
    const words = allText
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word =>
            word.length > 3 && // Filter out short words
            !commonWords.includes(word) // Filter out common words
        );

    // Count frequency
    const wordCounts: Record<string, number> = {};

    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Convert to array and sort by count
    const wordFrequency = Object.entries(wordCounts)
        .map(([word, count]) => ({
            word,
            count,
            weight: 0 // Will be calculated below
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30); // Take top 30 words

    // Calculate weight for visualization (1-10 scale)
    const maxCount = Math.max(...wordFrequency.map(item => item.count));
    const minCount = Math.min(...wordFrequency.map(item => item.count));

    return wordFrequency.map(item => ({
        ...item,
        weight: maxCount > minCount
            ? 1 + Math.floor(9 * (item.count - minCount) / (maxCount - minCount))
            : 5
    }));
}

// List of common words to filter out
const commonWords = [
    'digid', 'digid.nl', 'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
    'his', 'from', 'they', 'will', 'would', 'there', 'their', 'what', 'about',
    'which', 'when', 'make', 'like', 'time', 'just', 'know', 'take', 'people',
    'into', 'year', 'your', 'good', 'some', 'could', 'them', 'than', 'then',
    'look', 'only', 'come', 'over', 'think', 'also', 'back', 'after', 'work',
    'first', 'well', 'even', 'want', 'because', 'these', 'give', 'most'
]; 