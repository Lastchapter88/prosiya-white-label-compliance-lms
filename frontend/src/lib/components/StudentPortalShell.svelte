<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { chatOpen, toggleChat } from '$lib/stores/chatUi';
	import {
		cycleThemePreference,
		getStoredThemePreference,
		themePreferenceLabel,
		type ThemePreference
	} from '$lib/theme';

	export let showGreeting = false;

	let themePreference: ThemePreference = 'auto';

	const desktopNav = [
		{ href: '/student/dashboard', label: 'Home', match: '/student/dashboard' },
		{ href: '/student/courses', label: 'My courses', match: '/student/courses' },
		{ href: '/student/study-material', label: 'Study packs', match: '/student/study-material' },
		{ href: '/student/assessments', label: 'Assessments', match: '/student/assessments' },
		{ href: '/student/certificates', label: 'Certificates', match: '/student/certificates' },
		{ href: '/student/settings', label: 'Settings', match: '/student/settings' }
	];

	const mobileNav = [
		{ href: '/student/dashboard', label: 'Home', match: '/student/dashboard', icon: 'home' },
		{ href: '/student/courses', label: 'Courses', match: '/student/courses', icon: 'courses' },
		{ href: '/student/study-material', label: 'Study', match: '/student/study-material', icon: 'study' },
		{ href: '/student/more', label: 'More', match: '/student/more', icon: 'more' }
	];

	$: user = $auth.user;
	$: displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Learner';
	$: firstName = user?.first_name || 'Learner';
	$: initials =
		`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || 'P';
	$: avatar = user?.avatar || '';
	$: path = $page.url.pathname;
	$: chatIsOpen = $chatOpen;

	function isActive(match: string) {
		if (match === '/student/dashboard') return path === match;
		if (match === '/student/courses') {
			return path === '/student/courses' || path.startsWith('/student/courses/');
		}
		if (match === '/student/more') {
			return (
				path === '/student/more' ||
				path === '/student/settings' ||
				path === '/student/certificates' ||
				path === '/student/assessments'
			);
		}
		return path === match || path.startsWith(`${match}/`);
	}

	function cycleTheme() {
		themePreference = cycleThemePreference();
	}

	onMount(() => {
		themePreference = getStoredThemePreference();
		document.body.dataset.studentPortal = 'true';
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			delete document.body.dataset.studentPortal;
		}
	});
</script>

<div class="portal">
	<aside class="sidebar" aria-label="Student portal">
		<div class="brand">
			<img src="/images/logos/prosiya-logo.png" alt="ProSiya" class="brand-logo" />
			<div>
				<strong>ProSiya Academy</strong>
				<p>Learner portal</p>
			</div>
		</div>

		<nav class="side-nav">
			{#each desktopNav as item}
				<a href={item.href} class="side-link" class:active={isActive(item.match)}>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="side-user">
			{#if avatar}
				<img src={avatar} alt="" class="avatar" />
			{:else}
				<div class="avatar fallback">{initials}</div>
			{/if}
			<div class="side-user-copy">
				<strong>{displayName}</strong>
				<p>Student</p>
			</div>
		</div>
	</aside>

	<div class="portal-main">
		{#if showGreeting}
			<header class="topbar">
				<div class="identity">
					{#if avatar}
						<img src={avatar} alt="" class="avatar" />
					{:else}
						<div class="avatar fallback">{initials}</div>
					{/if}
					<div>
						<p class="eyebrow">Ready when you are</p>
						<h1>{firstName}</h1>
					</div>
				</div>
				<div class="top-actions">
					<button
						type="button"
						class="icon-btn"
						aria-label={themePreferenceLabel(themePreference)}
						on:click={cycleTheme}
					>
						{#if themePreference === 'night'}
							<svg viewBox="0 0 24 24" aria-hidden="true"
								><path
									fill="currentColor"
									d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM12 4a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm8 8a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM6 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm11.66 6.66a1 1 0 0 1-1.41 0l-.71-.7a1 1 0 0 1 1.41-1.42l.71.71a1 1 0 0 1 0 1.41ZM8.46 7.05a1 1 0 0 1-1.41 0l-.71-.7A1 1 0 0 1 7.75 4.93l.71.71a1 1 0 0 1 0 1.41Zm9.9-2.12a1 1 0 0 1 0 1.41l-.71.71A1 1 0 1 1 16.24 5.6l.71-.71a1 1 0 0 1 1.41 0ZM7.05 15.54a1 1 0 0 1 0 1.41l-.71.71A1 1 0 0 1 4.93 16.24l.71-.71a1 1 0 0 1 1.41 0Z"
								/></svg
							>
						{:else}
							<svg viewBox="0 0 24 24" aria-hidden="true"
								><path
									fill="currentColor"
									d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7 7 0 1 0 21 14.3Z"
								/></svg
							>
						{/if}
					</button>
					<a class="icon-btn" href="/student/more" aria-label="Notifications and account">
						<svg viewBox="0 0 24 24" aria-hidden="true"
							><path
								fill="currentColor"
								d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm8-6v-5a8 8 0 1 0-16 0v5l-2 2v1h20v-1l-2-2Z"
							/></svg
						>
					</a>
				</div>
			</header>
		{/if}

		<slot />
	</div>

	<nav class="bottom-nav" aria-label="Student navigation">
		<a href={mobileNav[0].href} class:active={isActive(mobileNav[0].match)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><path fill="currentColor" d="M12 3 4 10v10h5v-6h6v6h5V10l-8-7Z" /></svg
			>
			<span>Home</span>
		</a>
		<a href={mobileNav[1].href} class:active={isActive(mobileNav[1].match)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><path
					fill="currentColor"
					d="M4 5h7a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H4V5Zm9 0h7v12h-7a3 3 0 0 0-3 3V8a3 3 0 0 1 3-3Z"
				/></svg
			>
			<span>Courses</span>
		</a>

		<button
			type="button"
			class="fab"
			class:open={chatIsOpen}
			aria-label={chatIsOpen ? 'Close study assistant' : 'Open study assistant'}
			aria-pressed={chatIsOpen}
			on:click={toggleChat}
		>
			{#if chatIsOpen}
				×
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true"
					><path
						fill="currentColor"
						d="M4 4h16v12H7l-3 3V4Zm4 4v2h8V8H8Zm0 4v2h5v-2H8Z"
					/></svg
				>
			{/if}
		</button>

		<a href={mobileNav[2].href} class:active={isActive(mobileNav[2].match)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><path
					fill="currentColor"
					d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z"
				/></svg
			>
			<span>Study</span>
		</a>
		<a href={mobileNav[3].href} class:active={isActive(mobileNav[3].match)}>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				><path
					fill="currentColor"
					d="M5 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
				/></svg
			>
			<span>More</span>
		</a>
	</nav>
</div>

<style>
	.portal {
		min-height: 100vh;
		background: var(--color-bg-light);
		display: flex;
	}

	.sidebar {
		display: none;
		width: 260px;
		flex-shrink: 0;
		background: var(--color-navy-dark);
		color: white;
		padding: 1.5rem 1rem;
		flex-direction: column;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem 1.5rem;
	}

	.brand-logo {
		width: 40px;
		height: 40px;
		object-fit: contain;
		border-radius: 10px;
		background: white;
	}

	.brand strong,
	.side-user strong {
		display: block;
		font-size: 0.95rem;
	}

	.brand p,
	.side-user p {
		margin: 0.15rem 0 0;
		color: var(--color-text-dark-secondary);
		font-size: 0.8rem;
	}

	.side-nav {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.side-link {
		color: white;
		text-decoration: none;
		padding: 0.8rem 0.9rem;
		border-radius: 12px;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.side-link:hover,
	.side-link.active {
		background: var(--color-navy);
	}

	.side-link.active {
		box-shadow: inset 3px 0 0 var(--color-accent);
	}

	.side-user {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 0.75rem 0.25rem;
		border-top: 1px solid var(--color-navy);
	}

	.portal-main {
		flex: 1;
		min-width: 0;
		padding: max(1rem, env(safe-area-inset-top)) 1rem 7rem;
		max-width: 980px;
		margin: 0 auto;
		width: 100%;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.identity {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-width: 0;
	}

	.identity h1 {
		margin: 0;
		font-size: 1.45rem;
		color: var(--color-navy-dark);
		line-height: 1.15;
	}

	.eyebrow {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.85rem;
	}

	.top-actions {
		display: flex;
		gap: 0.5rem;
	}

	.icon-btn {
		width: 42px;
		height: 42px;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-navy-dark);
		border-radius: 14px;
		display: grid;
		place-items: center;
		text-decoration: none;
		cursor: pointer;
	}

	.icon-btn svg {
		width: 20px;
		height: 20px;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-accent);
		flex-shrink: 0;
	}

	.avatar.fallback {
		display: grid;
		place-items: center;
		background: var(--color-accent);
		color: var(--color-navy-dark);
		font-weight: 800;
	}

	.bottom-nav {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 40;
		display: grid;
		grid-template-columns: 1fr 1fr 72px 1fr 1fr;
		align-items: end;
		gap: 0.15rem;
		padding: 0.45rem 0.6rem calc(0.45rem + env(safe-area-inset-bottom));
		background: color-mix(in srgb, var(--color-surface) 92%, transparent);
		backdrop-filter: blur(16px);
		border-top: 1px solid var(--color-border);
	}

	.bottom-nav a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.35rem 0.2rem 0.15rem;
	}

	.bottom-nav a svg {
		width: 22px;
		height: 22px;
	}

	.bottom-nav a.active {
		color: var(--color-navy-dark);
	}

	.fab {
		width: 58px;
		height: 58px;
		margin: -1.4rem auto 0.15rem;
		border: none;
		border-radius: 50%;
		background: var(--color-accent);
		color: var(--color-navy-dark);
		box-shadow: 0 10px 24px color-mix(in srgb, var(--color-accent) 45%, transparent);
		font-size: 1.6rem;
		font-weight: 700;
		cursor: pointer;
		display: grid;
		place-items: center;
	}

	.fab svg {
		width: 26px;
		height: 26px;
	}

	.fab.open {
		background: var(--color-navy-dark);
		color: white;
	}

	@media (min-width: 960px) {
		.sidebar {
			display: flex;
		}

		.portal-main {
			max-width: none;
			padding: 2rem 2.25rem 2.5rem;
		}

		.bottom-nav {
			display: none;
		}

		.topbar {
			margin-bottom: 1.75rem;
		}

		.identity h1 {
			font-size: 1.8rem;
		}
	}
</style>
