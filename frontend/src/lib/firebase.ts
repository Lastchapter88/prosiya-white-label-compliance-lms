import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
	getAuth,
	initializeAuth,
	indexedDBLocalPersistence,
	browserLocalPersistence,
	browserPopupRedirectResolver,
	type Auth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { browser } from '$app/environment';

const firebaseConfig = {
	apiKey: 'AIzaSyDtixkjG7nJqo5eeYoKdwC-tGE91Cyh-xU',
	authDomain: 'prosiya-e751a.firebaseapp.com',
	projectId: 'prosiya-e751a',
	storageBucket: 'prosiya-e751a.firebasestorage.app',
	messagingSenderId: '942686815915',
	appId: '1:942686815915:web:013028a18690a8bf8959ee',
	measurementId: 'G-GMZDXPCYYP'
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
	if (!browser) {
		return getAuth(app);
	}

	try {
		return initializeAuth(app, {
			persistence: [indexedDBLocalPersistence, browserLocalPersistence],
			popupRedirectResolver: browserPopupRedirectResolver
		});
	} catch {
		return getAuth(app);
	}
}

export const auth = createAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

let analytics;
if (browser) {
	analytics = getAnalytics(app);
}

export { app, analytics };
