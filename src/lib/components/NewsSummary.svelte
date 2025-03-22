<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchNewsArticles, type Article } from '../services/news';

	// Type definitions
	let articles: Article[] = [];
	let loading = true;
	let error: string | null = null;

	async function loadNewsSummaries() {
		try {
			loading = true;
			error = null;

			// Fetch news articles
			articles = await fetchNewsArticles();
		} catch (err: any) {
			error = err.message || 'Failed to fetch news summaries';
			console.error('Error loading news summaries:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (articles.length === 0) {
			loadNewsSummaries();
		}

		// Set up refresh interval (every 30 minutes)
		const interval = setInterval(loadNewsSummaries, 30 * 60 * 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="card">
	<div class="card-header">
		<h2 class="section-title">News Summary</h2>
		<h4 class="section-subtitle">I heard AI gets you c-level executive brownie points</h4>
	</div>

	<div class="card-body">
		<div class="flex justify-between items-center mb-4">
			<button on:click={loadNewsSummaries} disabled={loading} class="refresh-button">
				{loading ? 'Loading...' : 'Refresh'}
			</button>
		</div>

		{#if loading && articles.length === 0}
			<div class="loading">
				<p>Fetching news summaries...</p>
			</div>
		{/if}

		{#if error}
			<div class="error">
				<p>{error}</p>
			</div>
		{/if}

		<div class="scrollable-container">
			{#if articles.length === 0 && !loading}
				<div class="loading">
					<p>No news items available.</p>
				</div>
			{:else}
				{#each articles as article (article.id)}
					<div class="item">
						<div class="flex justify-between items-start mb-2">
							<h3 class="text-primary flex-1 mr-2">{article.title}</h3>
							<span class="badge">{article.source}</span>
						</div>
						<p class="text-secondary mb-2">{article.description}</p>
						<div class="flex justify-between items-center text-muted text-sm">
							<span>{article.publishedAt}</span>
							{#if article.url}
								<a
									href={article.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-accent hover:underline">Source</a
								>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.card-body {
		padding-top: 1rem;
	}

	.flex-1 {
		flex: 1;
	}

	.mr-2 {
		margin-right: 0.5rem;
	}

	.text-sm {
		font-size: 0.875rem;
	}

	.hover\:underline:hover {
		text-decoration: underline;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #f27935;
		margin: 0;
	}

	.section-subtitle {
		color: #777;
		font-weight: 400;
		font-size: 1rem;
		margin-top: 0.25rem;
	}

	.loading {
		text-align: center;
		padding: 20px;
		color: #888;
	}

	.error {
		background-color: rgba(220, 76, 100, 0.2);
		color: #ff6b7d;
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 15px;
	}
</style>
