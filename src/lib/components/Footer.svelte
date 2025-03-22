<script>
	const userUrl = 'https://github.com/cochaviz';
	const repoUrl = 'https://github.com/cochaviz/digiddos';
</script>

<footer class="footer">
	<div class="footer-content">
		<p>created by: <a href={userUrl} target="_blank" rel="noopener noreferrer">cochaviz</a></p>
		<p>
			source: <a href={repoUrl} target="_blank" rel="noopener noreferrer">
				github.com/cochaviz/digiddos
			</a>
		</p>
	</div>
</footer>

<style>
	.footer {
		background-color: #121212;
		padding: 1rem;
		margin-top: 2rem;
	}

	.footer-content {
		max-width: 1200px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0 auto;
		padding: 1rem;
		text-align: center;
	}

	.footer p {
		margin: 0.5rem 0;
		color: #777;
	}

	.footer a {
		color: #f27935;
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer a:hover {
		color: #ff8f4d;
	}
</style>
