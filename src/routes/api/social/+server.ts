import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import axios from 'axios';

const BLUESKY_SERVICE = "https://public.api.bsky.app/xrpc";
const MIN_CHECK_INTERVAL = 30000; // 30 seconds in milliseconds
const LIMIT = 50;

// In-memory storage for last check time and response
let lastCheckTime = 0;
let lastResponse: any = null;

export const GET: RequestHandler = async ({ url }) => {
    const currentTime = Date.now();

    // Check if enough time has passed since the last check
    if (lastResponse && currentTime - lastCheckTime < MIN_CHECK_INTERVAL) {
        // Return the last stored response without making a new request
        return json(lastResponse);
    }

    try {
        const response = await axios.get(`${BLUESKY_SERVICE}/app.bsky.feed.searchPosts`, {
            params: {
                limit: LIMIT,
                q: 'digid'
            }
        });

        const posts = response.data?.posts?.map((post: any) => {
            return {
                id: post.uri,
                author: post.author?.displayName || 'Unknown',
                authorHandle: post.author?.handle || 'unknown',
                content: post.record?.text || '',
                createdAt: new Date(post.record?.createdAt).toLocaleString(),
                avatar: post.author?.avatar || ''
            };
        }) || [];

        const result = { posts };

        // Update last check time and store the response
        lastCheckTime = currentTime;
        lastResponse = result;

        return json(result);
    } catch (error) {
        console.error('Error fetching Bluesky posts:', error);
        return json({ posts: [] });
    }
}; 