<script lang="ts">
	import { paymentDetails, companyContact } from '$lib/data/companyProfile';

	/** compact = short inline block; full = study material / contact layout with CTA */
	export let variant: 'compact' | 'full' = 'full';
	export let showHeading = true;
</script>

<div class="payment-instructions" class:compact={variant === 'compact'}>
	{#if showHeading}
		<h3 class="payment-heading">How to pay</h3>
	{/if}

	<div class="payment-block">
		<h4>Local learners (South Africa)</h4>
		<p>
			After completing your course payment, please send your proof of payment (bank deposit slip,
			EFT receipt, or screenshot) directly to
			<a href={paymentDetails.whatsAppProofUrl} target="_blank" rel="noopener noreferrer">
				{paymentDetails.proofOfPaymentPhone} on WhatsApp
			</a>.
			Once verified, ProSiya Academy will unlock your study materials.
		</p>
	</div>

	<div class="payment-block">
		<h4>International learners</h4>
		<p>
			Payments may be made via PayPal to
			<a href={paymentDetails.paypalMailto}>{paymentDetails.paypalEmail}</a>.
			Please send your PayPal confirmation to
			<a href={paymentDetails.whatsAppProofUrl} target="_blank" rel="noopener noreferrer">
				{paymentDetails.proofOfPaymentPhone} on WhatsApp
			</a>
			so we can verify your payment and activate your account.
		</p>
	</div>

	{#if variant === 'full'}
		<div class="payment-actions">
			<a
				class="whatsapp-btn"
				href={paymentDetails.whatsAppProofUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				Send proof of payment on WhatsApp
			</a>
			<a class="secondary-link" href="mailto:{companyContact.email}">
				Or email {companyContact.email}
			</a>
		</div>
	{/if}
</div>

<style>
	.payment-instructions {
		text-align: left;
	}

	.payment-instructions.compact .payment-block {
		margin-bottom: 0.75rem;
	}

	.payment-heading {
		margin: 0 0 1rem;
		font-size: 1.125rem;
		color: var(--color-navy-dark);
	}

	.payment-block {
		margin-bottom: 1rem;
	}

	.payment-block h4 {
		margin: 0 0 0.35rem;
		font-size: 0.95rem;
		color: var(--color-navy-dark);
	}

	.payment-block p {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.payment-block a,
	.secondary-link {
		color: var(--color-navy-dark);
		font-weight: 600;
		text-decoration: none;
	}

	.payment-block a:hover,
	.secondary-link:hover {
		text-decoration: underline;
	}

	.payment-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	.whatsapp-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.25rem;
		background: #25d366;
		color: white;
		font-weight: 700;
		border-radius: var(--radius-md, 8px);
		text-decoration: none;
		transition: background 0.2s;
	}

	.whatsapp-btn:hover {
		background: #1ebe57;
		text-decoration: none;
	}

	.secondary-link {
		font-size: 0.9rem;
	}
</style>
