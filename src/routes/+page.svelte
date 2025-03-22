<script>
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Global CSS
	import '$lib/styles/global.css';
</script>

<div class="page-container">
	<main>
		<Dashboard />
	</main>
	<Footer />
</div>

<style>
	.page-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}
</style>
