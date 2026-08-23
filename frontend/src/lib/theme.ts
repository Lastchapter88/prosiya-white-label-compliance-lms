/** Night mode: 18:00–05:59 local time. Day mode: 06:00–17:59. */
export const NIGHT_START_HOUR = 18;
export const DAY_START_HOUR = 6;

export type ThemeMode = 'day' | 'night';

export function getThemeForHour(hour: number): ThemeMode {
	return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR ? 'night' : 'day';
}

export function getThemeForDate(date = new Date()): ThemeMode {
	return getThemeForHour(date.getHours());
}

export function applyTheme(theme: ThemeMode) {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-theme', theme);
	document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
}

export function initAutoTheme() {
	if (typeof window === 'undefined') return () => {};

	const update = () => applyTheme(getThemeForDate());

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
export const themeBootScript = `(function(){try{var h=new Date().getHours();var t=(h>=${NIGHT_START_HOUR}||h<${DAY_START_HOUR})?'night':'day';document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t==='night'?'dark':'light';}catch(e){}})();`;
