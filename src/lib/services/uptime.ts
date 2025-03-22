// Type definitions
export interface UptimeCheck {
    timestamp: Date;
    status: 'up' | 'down';
    responseTime: number; // in milliseconds
}

export interface UptimeStatus {
    current: 'up' | 'down' | 'checking';
    lastChecked: Date;
    responseTime: number;
    uptimePercentage: number;
    checks: UptimeCheck[];
}

// Constants for different time windows
export const SECONDS_10 = 10 * 1000; // 10 seconds in milliseconds
export const MINUTES_10 = 10 * 60 * 1000; // 10 minutes in milliseconds


// Function to get uptime status for a specific time window
export async function getUptimeStatus(
    domain: string,
    timeWindow: number = MINUTES_10,
): Promise<UptimeStatus> {
    try {
        const response = await fetch(`/api/uptime?timeWindow=${timeWindow}`);
        return await response.json();
    } catch (error) {
        console.error(`Error checking uptime for ${domain}:`, error);
        return {
            current: 'down',
            lastChecked: new Date(),
            responseTime: 0,
            uptimePercentage: 0,
            checks: []
        };
    }
}