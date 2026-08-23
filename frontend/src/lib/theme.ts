/** Night mode: 18:00–05:59 local time. Day mode: 06:00–17:59. */
export const NIGHT_START_HOUR = 18;
export const DAY_START_HOUR = 6;
export const THEME_PREFERENCE_KEY = 'prosiya-theme-preference';

export type ThemeMode = 'day' | 'night';
export type ThemePreference = 'auto' | ThemeMode;

export function getThemeForHour(hour: number): ThemeMode {
	return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR ? 'night' : 'day';
}

export function getThemeForDate(date = new Date()): ThemeMode {
	return getThemeForHour(date.getHours());
}

export function getStoredThemePreference(): ThemePreference {
	if (typeof localStorage === 'undefined') return 'auto';
	const stored = localStorage.getItem(THEME_PREFERENCE_KEY);
	if (stored === 'day' || stored === 'night' || stored === 'auto') return stored;
	return 'auto';
}

export function setThemePreference(preference: ThemePreference) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(THEME_PREFERENCE_KEY, preference);
	}
	applyResolvedTheme(preference);
}

export function resolveTheme(preference: ThemePreference, date = new Date()): ThemeMode {
	if (preference === 'auto') return getThemeForDate(date);
	return preference;
}

export function applyTheme(theme: ThemeMode) {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-theme', theme);
	document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
}

export function applyResolvedTheme(preference = getStoredThemePreference()) {
	applyTheme(resolveTheme(preference));
}

export function cycleThemePreference(): ThemePreference {
	const order: ThemePreference[] = ['auto', 'day', 'night'];
	const current = getStoredThemePreference();
	const next = order[(order.indexOf(current) + 1) % order.length];
	setThemePreference(next);
	return next;
}

export function themePreferenceLabel(preference: ThemePreference): string {
	if (preference === 'auto') return 'Auto theme';
	if (preference === 'night') return 'Night mode';
	return 'Day mode';
}

export function initAutoTheme() {
	if (typeof window === 'undefined') return () => {};

	const update = () => applyResolvedTheme(getStoredThemePreference());

	update();
	const interval = window.setInterval(update, 60_000);

	const onVisibility = () => {
		if (document.visibilityState === 'visible') update();
	};
	document.addEventListener('visibilitychange', onVisibility);

	return () => {
		window.clearInterval(interval);
		document.removeEventListener('visibilitychange', onVisibility);
	};
}

/** Inline script for app.html — prevents flash of wrong theme before JS loads. */
export const themeBootScript = `(function(){try{var p=localStorage.getItem('${THEME_PREFERENCE_KEY}');var h=new Date().getHours();var t=p==='day'||p==='night'?p:((h>=${NIGHT_START_HOUR}||h<${DAY_START_HOUR})?'night':'day');document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t==='night'?'dark':'light';}catch(e){}})();`;
