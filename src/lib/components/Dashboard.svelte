<script lang="ts">
	import BlueskyFeed from './BlueskyFeed.svelte';
	import NewsSummary from './NewsSummary.svelte';
	import UptimeMonitor from './UptimeMonitor.svelte';

	// You can pass custom props to components if needed
	export let domain: string = 'digid.nl';
</script>

<div class="dashboard">
	<header class="dashboard-header">
		<div class="logo-container">
			<h1>
				<span class="logo-text"
					>Dig<span class="accent-color">iDD</span>o<span class="accent-color">S</span></span
				>
			</h1>
			<p class="tagline">
				<span class="dutch-text">is het weer zover?</span> health monitoring and<br />intel
				concerning Dig<span class="accent-color">iD</span>
			</p>
		</div>
	</header>

	<div class="dashboard-grid">
		<div class="dashboard-column">
			<BlueskyFeed />
		</div>
		<div class="dashboard-column">
			<UptimeMonitor
				{domain}
				interval="seconds"
				title="Last 10 seconds?"
				subtitle="should be fine, right?"
			/>
			<UptimeMonitor
				{domain}
				interval="minutes"
				title="Last 10 minutes?"
				subtitle="really hope you're working on this..."
			/>
			<NewsSummary />
		</div>
	</div>
</div>

<style>
	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}

	.dashboard-header {
		margin-bottom: 2rem;
	}

	.logo-container {
		display: flex;
		flex-direction: row;
		justify-content: left;
		gap: 4rem;
		margin-bottom: 2rem;
	}

	.logo-text {
		font-size: 3.5rem;
		font-weight: 700;
		letter-spacing: -1px;
	}

	.tagline {
		font-size: 1.2rem;
		margin-top: 0.5rem;
		color: #cccccc;
	}

	.dutch-text {
		color: #f27935;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 2fr 3fr;
		}
	}

	.dashboard-column {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	:global(.accent-color) {
		color: #f27935;
	}
</style>
