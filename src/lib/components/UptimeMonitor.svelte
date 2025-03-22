<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getUptimeStatus, SECONDS_10, MINUTES_10, type UptimeCheck } from '../services/uptime';

	export let domain: string = 'digid.nl';
	export let interval: 'seconds' | 'minutes' = 'minutes';
	export let title: string = interval === 'seconds' ? 'Last 10 seconds?' : 'Last 10 minutes?';
	export let subtitle: string = 'I guess this is fine?';

	let status: 'up' | 'down' | 'checking' = 'checking';
	let lastChecked: string = '';
	let uptimePercentage: number = 100;
	let intervalId: number;

	async function checkStatus() {
		try {
			// Get uptime status based on interval
			const timeRange = interval === 'seconds' ? SECONDS_10 : MINUTES_10;
			const uptimeStatus = await getUptimeStatus(domain, timeRange);

			// Update component state
			status = uptimePercentage < 99 ? 'down' : 'up';
			lastChecked = new Date(uptimeStatus.lastChecked).toLocaleTimeString();
			uptimePercentage = uptimeStatus.uptimePercentage;
		} catch (error) {
			console.error('Error checking status:', error);
		}
	}

	onMount(() => {
		// Initial check
		checkStatus();

		// Set up interval for regular checks
		const checkInterval = interval === 'seconds' ? 10000 : 60000;
		intervalId = setInterval(checkStatus, checkInterval);

		return () => {
			clearInterval(intervalId);
		};
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div class="card {status === 'up' ? 'status-up' : 'status-down'}">
	<div class="card-header">
		<h2 class="section-title">{title}</h2>
		<h4 class="section-subtitle">{subtitle}</h4>
	</div>

	<div class="card-body">
		<div class="uptime-grid">
			<div class="uptime-status">
				{#if status === 'checking'}
					<span class="text-muted text-4xl font-bold">CHECKING</span>
				{:else if status === 'up'}
					<span class="text-primary text-4xl font-bold">UP</span>
				{:else}
					<span class="text-primary text-4xl font-bold">DOWN</span>
				{/if}
			</div>

			<div class="uptime-info">
				<div class="text-secondary">
					<p class="mb-2">Domain: <strong class="text-primary">{domain}</strong></p>
					<p class="mb-2">Last checked: <strong class="text-primary">{lastChecked}</strong></p>
					<p>Uptime: <strong class="text-primary">{uptimePercentage}%</strong></p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.uptime-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: center;
	}

	.uptime-status {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 1rem;
		background-color: rgba(242, 121, 53, 0.1);
		border-radius: 8px;
	}

	.text-4xl {
		font-size: 3rem;
	}

	@media (max-width: 640px) {
		.uptime-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.uptime-status {
			padding: 0.5rem;
		}

		.text-4xl {
			font-size: 2.5rem;
		}
	}
</style>
