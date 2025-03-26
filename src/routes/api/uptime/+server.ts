import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import axios from 'axios';

const DIGID_DOMAIN = 'digid.nl';
const MIN_CHECK_INTERVAL = 10000; // 10 seconds in milliseconds
const MAX_CHECK_INTERVAL = 600000; // 10 minutes in milliseconds

// In-memory storage for checks and last check time
let lastCheckTime = 0;
let storedChecks: Array<{
    timestamp: Date;
    status: 'up' | 'down';
    responseTime: number;
}> = [];

export const GET: RequestHandler = async ({ url }) => {
    const timeWindow = parseInt(url.searchParams.get('timeWindow') || '600000'); // Default 10 minutes
    const currentTime = Date.now();

    // Check if enough time has passed since the last check
    if (currentTime - lastCheckTime < MIN_CHECK_INTERVAL) {
        // Return the last stored check without making a new request
        return json({
            current: storedChecks[0]?.status || 'down',
            lastChecked: storedChecks[0]?.timestamp || new Date(),
            responseTime: storedChecks[0]?.responseTime || 0,
            uptimePercentage: calculateUptimePercentage(storedChecks),
            checks: storedChecks.slice(0, timeWindow / 1000)
        });
    }

    const startTime = Date.now();
    const response = await axios.get(`https://${DIGID_DOMAIN}`, {
        timeout: 5000,
        validateStatus: (status) => status < 500 // Consider any status < 500 as "up"
    }).catch((error) => {
        console.log(`Error raised while checking uptime for ${DIGID_DOMAIN}:`, error);
        return { status: 500, data: null };
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const check = {
        timestamp: new Date(),
        status: response.status < 500 ? 'up' as const : 'down' as const,
        responseTime: response.status < 500 ? responseTime : 0
    };

    // Update last check time
    lastCheckTime = currentTime;

    // Add new check to the beginning of the array
    storedChecks.unshift(check);

    // Keep only the checks within the max check interval
    storedChecks = storedChecks.filter(check => currentTime - check.timestamp.getTime() < MAX_CHECK_INTERVAL);
    const windowChecks = storedChecks.filter(check => currentTime - check.timestamp.getTime() < timeWindow);

    const uptimeStatus = {
        current: check.status,
        lastChecked: check.timestamp,
        responseTime: check.responseTime,
        uptimePercentage: calculateUptimePercentage(windowChecks),
    };

    return json(uptimeStatus);
};

function calculateUptimePercentage(checks: any[]) {
    if (checks.length === 0) return 100;
    const upChecks = checks.filter(check => check.status === 'up');
    return Math.round((upChecks.length / checks.length) * 100);
}