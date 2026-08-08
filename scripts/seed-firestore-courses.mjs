/**
 * Seed ProSiya course catalogue into Firestore using Firebase CLI login tokens.
 * Usage: node scripts/seed-firestore-courses.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PROJECT_ID = 'prosiya-e751a';
const CONFIG_PATH = join(homedir(), '.config', 'configstore', 'firebase-tools.json');

const courses = [
	{
		id: 'combined-grade-e-d-c',
		title: 'Combined Grade E, D & C',
		slug: 'combined-grade-e-d-c',
		description:
			'Combined security officer training covering Grades E, D and C. Ideal for new entrants who need the full entry-to-intermediate pathway.',
		short_description: 'Grades E, D & C combined package.',
		category: 'Security',
		level: 'beginner',
		duration_hours: 120,
		price: 1950,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/security-training.png',
		features: ['Grades E, D & C combined', 'PSIRA-aligned', 'Compliance-ready'],
		psira_code: 'XO-EDC',
		is_featured: true,
		order: 1
	},
	{
		id: 'grade-c-security',
		title: 'Grade C Security Officer',
		slug: 'grade-c-security',
		description: 'Individual Grade C security officer training for PSIRA-aligned competency.',
		short_description: 'Individual Grade C security training.',
		category: 'Security',
		level: 'intermediate',
		duration_hours: 40,
		price: 1050,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/security-training.png',
		features: ['Grade C individual', 'PSIRA-aligned', 'Compliance-ready'],
		psira_code: 'XO-C',
		is_featured: true,
		order: 2
	},
	{
		id: 'grade-b-security',
		title: 'Grade B Security Officer',
		slug: 'grade-b-security',
		description: 'Grade B supervisory-level security officer training.',
		short_description: 'Individual Grade B security training.',
		category: 'Security',
		level: 'intermediate',
		duration_hours: 40,
		price: 1500,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/security-training.png',
		features: ['Grade B individual', 'PSIRA-aligned', 'Compliance-ready'],
		psira_code: 'XO-B',
		is_featured: true,
		order: 3
	},
	{
		id: 'grade-a-security',
		title: 'Grade A Security Officer',
		slug: 'grade-a-security',
		description: 'Grade A advanced security officer training.',
		short_description: 'Individual Grade A security training.',
		category: 'Security',
		level: 'advanced',
		duration_hours: 40,
		price: 1500,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/security-training.png',
		features: ['Grade A individual', 'PSIRA-aligned', 'Compliance-ready'],
		psira_code: 'XO-A',
		is_featured: true,
		order: 4
	},
	{
		id: 'armed-response',
		title: 'Armed Response',
		slug: 'armed-response',
		description: 'Armed response officer training for the private security industry.',
		short_description: 'Armed response officer training.',
		category: 'Security',
		level: 'advanced',
		duration_hours: 40,
		price: 1600,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/armed-response.png',
		features: ['Armed response training', 'Industry-ready', 'Compliance-ready'],
		psira_code: 'XO-AR',
		is_featured: true,
		order: 5
	},
	{
		id: 'cit',
		title: 'CIT',
		slug: 'cit',
		description:
			'Cash-in-transit (CIT) training covering procedures, risk awareness, and operational requirements for the security industry.',
		short_description: 'Cash-in-transit (CIT) training.',
		category: 'Security',
		level: 'advanced',
		duration_hours: 40,
		price: 1600,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/armed-response.png',
		features: ['Cash-in-transit', 'Industry-ready', 'Compliance-ready'],
		psira_code: 'XO-CIT',
		is_featured: true,
		order: 6
	},
	{
		id: 'cpo',
		title: 'CPO',
		slug: 'cpo',
		description:
			'Close Protection Officer (CPO) training covering advanced protection skills, threat assessment, and operational readiness.',
		short_description: 'Close Protection Officer (CPO) training.',
		category: 'Security',
		level: 'advanced',
		duration_hours: 160,
		price: 16750,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/armed-response.png',
		features: ['Close protection', 'Advanced training', 'Industry-ready'],
		psira_code: 'XO-CPO',
		is_featured: true,
		order: 7
	},
	{
		id: 'handgun-business-purpose',
		title: 'Handgun Business Purpose',
		slug: 'handgun-business-purpose',
		description:
			'Firearm competency training for handgun use for business purposes, covering legal requirements, safe handling, and practical competency.',
		short_description: 'Handgun competency for business purposes.',
		category: 'Firearm',
		level: 'intermediate',
		duration_hours: 40,
		price: 2650,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/firearm-training.png',
		features: ['Handgun competency', 'Business purpose', 'Legal compliance'],
		psira_code: 'FA-HG',
		is_featured: true,
		order: 8
	},
	{
		id: 'rifle-slr-carbine',
		title: 'Rifle SLR or Carbine',
		slug: 'rifle-slr-carbine',
		description:
			'Firearm competency training for rifle SLR or carbine, covering legal requirements, safe handling, and practical competency.',
		short_description: 'Rifle SLR or carbine competency training.',
		category: 'Firearm',
		level: 'intermediate',
		duration_hours: 40,
		price: 2850,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/firearm-training.png',
		features: ['Rifle / SLR / Carbine', 'Competency certification', 'Legal compliance'],
		psira_code: 'FA-RF',
		is_featured: true,
		order: 9
	},
	{
		id: 'shotgun-business-purpose',
		title: 'Shotgun for Business Purpose',
		slug: 'shotgun-business-purpose',
		description:
			'Firearm competency training for shotgun use for business purposes, covering legal requirements, safe handling, and practical competency.',
		short_description: 'Shotgun competency for business purposes.',
		category: 'Firearm',
		level: 'intermediate',
		duration_hours: 40,
		price: 2700,
		currency: 'ZAR',
		status: 'published',
		cover_image: '/images/courses/firearm-training.png',
		features: ['Shotgun competency', 'Business purpose', 'Legal compliance'],
		psira_code: 'FA-SG',
		is_featured: true,
		order: 10
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
	if (Array.isArray(value)) {
		return {
			arrayValue: {
				values: value.map((item) => toFirestoreValue(item))
			}
		};
	}
	if (typeof value === 'object') {
		return {
			mapValue: {
				fields: Object.fromEntries(
					Object.entries(value).map(([k, v]) => [k, toFirestoreValue(v)])
				)
			}
		};
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
		expires_at: Date.now() + refreshed.expires_in * 1000,
		expires_in: refreshed.expires_in,
		scope: refreshed.scope,
		token_type: refreshed.token_type,
		id_token: refreshed.id_token || tokens.id_token
	};
	writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
	return refreshed.access_token;
}

async function upsertCourse(accessToken, course) {
	const { id, ...data } = course;
	const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/courses/${id}`;
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			toFirestoreDocument({
				...data,
				updated_at: new Date().toISOString(),
				tenant_id: 'prosiya'
			})
		)
	});

	if (!response.ok) {
		throw new Error(`Failed to upsert ${id}: ${response.status} ${await response.text()}`);
	}

	console.log(`Upserted: ${course.title} (R${course.price})`);
}

async function main() {
	const accessToken = await getAccessToken();
	for (const course of courses) {
		await upsertCourse(accessToken, course);
	}
	console.log(`Done. Seeded ${courses.length} courses into Firestore (${PROJECT_ID}).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
