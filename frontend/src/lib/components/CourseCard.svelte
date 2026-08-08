<script lang="ts">
	// Course card component matching mockup design
	export let title: string;
	export let image: string;
	export let features: string[] = [];
	export let href: string = '#';
	export let price: number | null = null;
	export let currency: string = 'ZAR';

	$: priceLabel =
		price == null
			? null
			: currency === 'ZAR'
				? `R${Number(price).toLocaleString('en-ZA')}`
				: `${currency} ${Number(price).toLocaleString('en-ZA')}`;
</script>

<div class="course-card">
	<div class="course-image">
		<img src={image} alt={title} />
	</div>
	
	<div class="course-content">
		<h3 class="course-title">{title}</h3>

		{#if priceLabel}
			<p class="course-price">{priceLabel}</p>
		{/if}
		
		{#if features.length > 0}
			<ul class="feature-list">
				{#each features as feature}
					<li>{feature}</li>
				{/each}
			</ul>
		{/if}
		
		<a href={href} class="btn btn-accent">View Course</a>
	</div>
</div>

<style>
	.course-card {
		background: white;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-card);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.course-card:hover {
		transform: translateY(-8px);
		box-shadow: var(--shadow-card-hover);
	}
	
	.course-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: var(--color-bg-light);
	}
	
	.course-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	
	.course-card:hover .course-image img {
		transform: scale(1.05);
	}
	
	.course-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}
	
	.course-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin: 0;
	}

	.course-price {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-accent-dark, var(--color-navy-dark));
	}
	
	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
		flex: 1;
	}
	
	.feature-list li {
		padding-left: 1.5rem;
		position: relative;
		margin-bottom: 0.75rem;
		color: var(--color-text-secondary);
		font-size: 0.95rem;
		line-height: 1.5;
	}
	
	.feature-list li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-accent);
		font-weight: bold;
		font-size: 1.1rem;
	}
	
	.btn {
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		text-decoration: none;
		text-align: center;
		transition: all 0.3s ease;
		display: inline-block;
		margin-top: auto;
	}
	
	.btn-accent {
		background: var(--color-accent);
		color: var(--color-navy-dark);
		border: none;
	}
	
	.btn-accent:hover {
		background: var(--color-accent-dark);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}
	
	/* Responsive */
	@media (max-width: 640px) {
		.course-image {
			height: 180px;
		}
		
		.course-title {
			font-size: 1.25rem;
		}
	}
</style>
