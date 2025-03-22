<script lang="ts">
	import { onMount } from 'svelte';
	import {
		fetchSocialPosts,
		analyzeWordFrequency,
		type BlueskyPost,
		type WordFrequency
	} from '../services/social';
	import '../styles/shared.css';

	let posts: BlueskyPost[] = [];
	let wordFrequencies: WordFrequency[] = [];
	let error: string | null = null;
	let loading = true;

	async function loadBlueskyData() {
		try {
			loading = true;

			// Fetch posts from Bluesky
			posts = await fetchSocialPosts();

			// Analyze word frequency
			wordFrequencies = analyzeWordFrequency(posts);
		} catch (err: any) {
			error = err.message || 'Failed to fetch Bluesky posts';
			console.error('Error fetching Bluesky data:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadBlueskyData();

		// Set up refresh interval (every 5 minutes)
		const interval = setInterval(loadBlueskyData, 5 * 60 * 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="card">
	<div class="card-header">
		<h2 class="section-title">Socials</h2>
		<h4 class="section-subtitle">What do the people have to say?</h4>
	</div>

	<div class="card-body">
		<!-- Word Web Visualization -->
		<div class="word-web-container">
			{#if wordFrequencies.length > 0}
				<div class="word-web">
					{#each wordFrequencies as wordFreq}
						<span
							class="word-tag"
							style="font-size: {0.7 + wordFreq.weight * 0.15}rem; opacity: {0.6 +
								wordFreq.weight * 0.04};"
						>
							{wordFreq.word}
						</span>
					{/each}
				</div>
			{:else if loading}
				<div class="loading">
					<p>Analyzing word frequencies...</p>
				</div>
			{:else}
				<div class="loading">
					<p>No word frequency data available.</p>
				</div>
			{/if}
		</div>

		{#if error}
			<div class="error">
				<p>{error}</p>
				<button on:click={loadBlueskyData} class="refresh-button">Try again</button>
			</div>
		{/if}

		{#if loading && posts.length === 0}
			<div class="loading">
				<p>Loading Bluesky posts...</p>
			</div>
		{/if}

		<!-- Recent Posts -->
		<h3 class="section-title text-lg mb-4">Recent Posts</h3>
		<div class="flex justify-center mb-4">
			<button on:click={loadBlueskyData} disabled={loading} class="refresh-button">
				{loading ? 'Loading...' : 'Refresh'}
			</button>
		</div>
		<div class="scrollable-container">
			{#each posts as post (post.id)}
				<div class="item">
					<div class="flex items-center mb-2">
						<div class="avatar">
							{#if post.avatar}
								<img src={post.avatar} alt={post.author} />
							{:else}
								<div class="avatar-placeholder">{post.author[0]}</div>
							{/if}
						</div>
						<div class="flex-col ml-2">
							<span class="text-primary font-bold">{post.author}</span>
							<span class="text-muted text-sm">@{post.authorHandle}</span>
						</div>
					</div>
					<div class="text-primary mb-2">{post.content}</div>
					<div class="text-muted text-sm text-right">{post.createdAt}</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.card-body {
		padding-top: 1rem;
	}

	.word-web-container {
		margin-bottom: 20px;
		background-color: #121212;
		border-radius: 8px;
		min-height: 200px;
		padding-bottom: 2rem;
	}

	@media (min-width: 767px) {
		.word-web-container {
			padding: 2rem;
		}
	}

	.word-web {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		line-height: 1.8;
	}

	.word-tag {
		color: #f27935;
		padding: 4px 8px;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.word-tag:hover {
		transform: scale(1.1);
		opacity: 1 !important;
		cursor: pointer;
		background-color: rgba(242, 121, 53, 0.1);
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		background-color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-placeholder {
		font-weight: bold;
		color: #f27935;
		font-size: 1.2rem;
	}

	.text-lg {
		font-size: 1.125rem;
	}

	.ml-2 {
		margin-left: 0.5rem;
	}

	.font-bold {
		font-weight: bold;
	}

	.text-right {
		text-align: right;
	}
</style>
