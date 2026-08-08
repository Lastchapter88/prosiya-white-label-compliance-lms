<script lang="ts">
	// Footer component with partner logos - all from /images/badges
</script>

<footer class="footer">
	<!-- Partner Logos Section -->
	<div class="container">
		<div class="partners-section">
			<h3 class="partners-title">Accredited Training Provider</h3>
			<div class="partner-logos">
				<img src="/images/badges/psira.png" alt="PSIRA Accredited" class="partner-logo" />
				<img src="/images/badges/qcto.png" alt="QCTO Quality Assured" class="partner-logo" />
				<img src="/images/badges/sasseta.png" alt="SASSETA Accredited" class="partner-logo" />
				<img src="/images/badges/firearm%20accreditation.png" alt="Firearm Accreditation" class="partner-logo" />
				<img src="/images/badges/SAPS.png" alt="SAPS" class="partner-logo" />
			</div>
		</div>
		
		<!-- Footer Content -->
		<div class="footer-content">
			<div class="footer-section">
				<h4>About ProSiya</h4>
				<p>Professional Security & Firearms Training Academy providing compliance-grade training for the security industry.</p>
			</div>
			
			<div class="footer-section">
				<h4>Quick Links</h4>
				<ul>
					<li><a href="/courses">Courses</a></li>
					<li><a href="/accreditation">Accreditation</a></li>
					<li><a href="/about">About Us</a></li>
					<li><a href="/contact">Contact</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h4>Contact</h4>
				<ul>
					<li>📧 info@prosiya.co.za</li>
					<li>📞 <a href="tel:+27785236606">+27 78 523 6606</a></li>
					<li>📍 Durban, South Africa</li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h4>Legal</h4>
				<ul>
					<li><a href="/privacy">Privacy Policy</a></li>
					<li><a href="/terms">Terms of Service</a></li>
					<li><a href="/popia">POPIA Compliance</a></li>
				</ul>
			</div>
		</div>
		
		<!-- Copyright -->
		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} ProSiya Academy. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-navy-dark);
		color: white;
		padding: 3rem 0 1.5rem;
		margin-top: 4rem;
	}
	
	/* Partners Section */
	.partners-section {
		text-align: center;
		padding: 2rem 0 3rem;
		border-bottom: 1px solid var(--color-navy);
		margin-bottom: 3rem;
	}
	
	.partners-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 2rem;
		color: var(--color-text-dark-secondary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.partner-logos {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		flex-wrap: wrap;
	}
	
	.partner-logo {
		height: 80px;
		width: auto;
		object-fit: contain;
		opacity: 0.9;
		transition: all 0.3s ease;
	}
	
	.partner-logo:hover {
		opacity: 1;
		transform: scale(1.05);
	}
	
	/* Footer Content */
	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	.footer-section h4 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-accent);
	}
	
	.footer-section p {
		color: var(--color-text-dark-secondary);
		line-height: 1.6;
		margin: 0;
	}
	
	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.footer-section li {
		margin-bottom: 0.5rem;
		color: var(--color-text-dark-secondary);
	}
	
	.footer-section a {
		color: var(--color-text-dark-secondary);
		text-decoration: none;
		transition: color 0.2s ease;
	}
	
	.footer-section a:hover {
		color: var(--color-accent);
	}
	
	/* Footer Bottom */
	.footer-bottom {
		text-align: center;
		padding-top: 2rem;
		border-top: 1px solid var(--color-navy);
	}
	
	.footer-bottom p {
		color: var(--color-text-dark-secondary);
		margin: 0;
		font-size: 0.875rem;
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.partner-logos {
			gap: 2rem;
		}
		
		.partner-logo {
			height: 60px;
		}
		
		.footer-content {
			grid-template-columns: 1fr;
		}
	}
</style>
