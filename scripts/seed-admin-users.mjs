/**
 * Promote whitelisted admin emails in Firestore (role: admin).
 * Run after those accounts have signed up at least once:
 *   node scripts/seed-admin-users.mjs
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const ADMIN_EMAILS = ['luckysekhula@gmail.com', 'dladla.siya@gmail.com'];

function loadServiceAccount() {
	const candidates = [
		join(root, 'serviceAccountKey.json'),
		join(root, 'firebase-service-account.json'),
		join(root, 'backend', 'serviceAccountKey.json')
	];
	for (const path of candidates) {
		if (existsSync(path)) {
			return JSON.parse(readFileSync(path, 'utf8'));
		}
	}
	throw new Error(
		'Service account JSON not found. Place serviceAccountKey.json in the project root.'
	);
}

const app = initializeApp({ credential: cert(loadServiceAccount()) });
const db = getFirestore(app);

async function main() {
	const snap = await db.collection('users').get();
	let updated = 0;

	for (const docSnap of snap.docs) {
		const data = docSnap.data();
		const email = (data.email || '').toLowerCase().trim();
		if (!ADMIN_EMAILS.includes(email)) continue;

		if (data.role === 'admin') {
			console.log(`Already admin: ${email}`);
			continue;
		}

		await docSnap.ref.update({
			role: 'admin',
			updatedAt: new Date().toISOString()
		});
		console.log(`Promoted to admin: ${email}`);
		updated++;
	}

	if (updated === 0) {
		console.log(
			'No users updated. Ensure luckysekhula@gmail.com and dladla.siya@gmail.com have registered first.'
		);
	} else {
		console.log(`Done. ${updated} user(s) promoted to admin.`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
