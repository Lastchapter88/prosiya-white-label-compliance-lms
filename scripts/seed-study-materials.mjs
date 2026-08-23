/**
 * Upload study material PDFs to Firebase Storage and seed Firestore metadata.
 * Usage: node scripts/seed-study-materials.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, basename } from 'node:path';

const PROJECT_ID = 'prosiya-e751a';
const BUCKET = 'prosiya-e751a.firebasestorage.app';
const CONFIG_PATH = join(homedir(), '.config', 'configstore', 'firebase-tools.json');
const SOURCE_DIR = join(process.cwd(), 'docs', 'Study Material');

const materials = [
	{
		id: 'grade-c-individual',
		courseSlug: 'grade-c-security',
		courseTitle: 'Grade C Security Officer',
		title: 'Grade C Study Material',
		grade: 'C',
		file: 'Grade C.pdf',
		order: 1
	},
	{
		id: 'grade-c-combined',
		courseSlug: 'combined-grade-e-d-c',
		courseTitle: 'Combined Grade E, D & C',
		title: 'Grade C Study Material',
		grade: 'C',
		file: 'Grade C.pdf',
		order: 1
	},
	{
		id: 'grade-d-combined',
		courseSlug: 'combined-grade-e-d-c',
		courseTitle: 'Combined Grade E, D & C',
		title: 'Grade D Study Material',
		grade: 'D',
		file: 'Grade D.pdf',
		order: 2
	},
	{
		id: 'grade-e-combined',
		courseSlug: 'combined-grade-e-d-c',
		courseTitle: 'Combined Grade E, D & C',
		title: 'Grade E Study Material',
		grade: 'E',
		file: 'Grade E.pdf',
		order: 3
	}
];

function toFirestoreValue(value) {
	if (value === null || value === undefined) return { nullValue: null };
	if (typeof value === 'string') return { stringValue: value };
	if (typeof value === 'boolean') return { booleanValue: value };
	if (typeof value === 'number') {
		return Number.isInteger(value)
			? { integerValue: String(value) }
			: { doubleValue: value };
	}
	return { stringValue: String(value) };
}

function toFirestoreDocument(data) {
	return {
		fields: Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, toFirestoreValue(value)])
		)
	};
}

async function getAccessToken() {
	const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
	const tokens = config.tokens;
	if (!tokens?.refresh_token) {
		throw new Error('No Firebase CLI refresh token found. Run: firebase login');
	}

	const expiresAt = Number(tokens.expires_at || 0);
	if (tokens.access_token && Date.now() < expiresAt - 60_000) {
		return tokens.access_token;
	}

	const body = new URLSearchParams({
		client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
		client_secret: 'jEQ6QVS93sf-AIlOYFjBFMms',
		grant_type: 'refresh_token',
		refresh_token: tokens.refresh_token
	});

	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body
	});

	if (!response.ok) {
		throw new Error(`Token refresh failed: ${response.status} ${await response.text()}`);
	}

	const refreshed = await response.json();
	config.tokens = {
		...tokens,
		access_token: refreshed.access_token,
		expires_at: Date.now() + refreshed.expires_in * 1000
	};
	writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
	return refreshed.access_token;
}

async function uploadPdf(accessToken, storagePath, localPath) {
	const fileBuffer = readFileSync(localPath);
	const url =
		`https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o` +
		`?uploadType=media&name=${encodeURIComponent(storagePath)}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/pdf'
		},
		body: fileBuffer
	});

	if (!response.ok) {
		throw new Error(`Upload failed for ${storagePath}: ${response.status} ${await response.text()}`);
	}

	console.log(`Uploaded: ${storagePath}`);
}

async function upsertStudyMaterial(accessToken, material, storagePath) {
	const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/study_materials/${material.id}`;
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			toFirestoreDocument({
				courseSlug: material.courseSlug,
				courseTitle: material.courseTitle,
				title: material.title,
				grade: material.grade,
				fileName: material.file,
				storagePath,
				order: material.order,
				updated_at: new Date().toISOString()
			})
		)
	});

	if (!response.ok) {
		throw new Error(`Firestore upsert failed for ${material.id}: ${response.status} ${await response.text()}`);
	}

	console.log(`Catalogued: ${material.title} → ${material.courseSlug}`);
}

async function main() {
	const accessToken = await getAccessToken();
	const metadataOnly = process.argv.includes('--metadata-only');
	const uploaded = new Set();

	for (const material of materials) {
		const localPath = join(SOURCE_DIR, material.file);
		if (!existsSync(localPath)) {
			throw new Error(`Missing source file: ${localPath}`);
		}

		const storagePath = `courses/${material.courseSlug}/study-material/${basename(material.file)}`;

		if (!metadataOnly) {
			if (!uploaded.has(storagePath)) {
				try {
					await uploadPdf(accessToken, storagePath, localPath);
					uploaded.add(storagePath);
				} catch (error) {
					console.warn(`Upload skipped for ${storagePath}: ${error.message}`);
					console.warn('Run with --metadata-only or enable Firebase Storage + billing, then re-run.');
				}
			}
		}

		await upsertStudyMaterial(accessToken, material, storagePath);
	}

	console.log(`Done. Seeded ${materials.length} study material records${metadataOnly ? ' (metadata only)' : ''}.`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
