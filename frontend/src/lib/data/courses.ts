/** Public course catalogue with current ProSiya pricing (ZAR). */
export const courseCatalogue = [
	{
		title: 'Combined Grade E, D & C',
		slug: 'combined-grade-e-d-c',
		image: '/images/courses/combined-grade-e-d-c.png',
		price: 1950,
		currency: 'ZAR',
		short_description: 'Entry-to-intermediate security officer training covering Grades E, D and C.',
		category: 'Security',
		level: 'beginner',
		features: ['Grades E, D & C combined', 'PSIRA-aligned', 'Compliance-ready']
	},
	{
		title: 'Grade C Security Officer',
		slug: 'grade-c-security',
		image: '/images/courses/grade-c-security.jpg',
		price: 1050,
		currency: 'ZAR',
		short_description: 'Individual Grade C security officer training.',
		category: 'Security',
		level: 'intermediate',
		features: ['Grade C individual', 'PSIRA-aligned', 'Compliance-ready']
	},
	{
		title: 'Grade B Security Officer',
		slug: 'grade-b-security',
		image: '/images/courses/grade-b-security.jpg',
		price: 1500,
		currency: 'ZAR',
		short_description: 'Grade B supervisory-level security officer training.',
		category: 'Security',
		level: 'intermediate',
		features: ['Grade B individual', 'PSIRA-aligned', 'Compliance-ready']
	},
	{
		title: 'Grade A Security Officer',
		slug: 'grade-a-security',
		image: '/images/courses/grade-a-security.jpg',
		price: 1500,
		currency: 'ZAR',
		short_description: 'Grade A advanced security officer training.',
		category: 'Security',
		level: 'advanced',
		features: ['Grade A individual', 'PSIRA-aligned', 'Compliance-ready']
	},
	{
		title: 'Armed Response',
		slug: 'armed-response',
		image: '/images/courses/armed-response.png',
		price: 1600,
		currency: 'ZAR',
		short_description: 'Armed response officer training for the security industry.',
		category: 'Security',
		level: 'advanced',
		features: ['Armed response training', 'Industry-ready', 'Compliance-ready']
	},
	{
		title: 'CIT',
		slug: 'cit',
		image: '/images/courses/cit.jpg',
		price: 1600,
		currency: 'ZAR',
		short_description: 'Cash-in-transit (CIT) training for the security industry.',
		category: 'Security',
		level: 'advanced',
		features: ['Cash-in-transit', 'Industry-ready', 'Compliance-ready']
	},
	{
		title: 'CPO',
		slug: 'cpo',
		image: '/images/courses/cpo.jpg',
		price: 16750,
		currency: 'ZAR',
		short_description: 'Close Protection Officer (CPO) training.',
		category: 'Security',
		level: 'advanced',
		features: ['Close protection', 'Advanced training', 'Industry-ready']
	},
	{
		title: 'Handgun Business Purpose',
		slug: 'handgun-business-purpose',
		image: '/images/courses/handgun-business-purpose.jpg',
		price: 2650,
		currency: 'ZAR',
		short_description: 'Firearm competency for handgun use for business purposes.',
		category: 'Firearm',
		level: 'intermediate',
		features: ['Handgun competency', 'Business purpose', 'Legal compliance']
	},
	{
		title: 'Rifle SLR or Carbine',
		slug: 'rifle-slr-carbine',
		image: '/images/courses/firearm-training.png',
		price: 2850,
		currency: 'ZAR',
		short_description: 'Firearm competency for rifle SLR or carbine.',
		category: 'Firearm',
		level: 'intermediate',
		features: ['Rifle / SLR / Carbine', 'Competency certification', 'Legal compliance']
	},
	{
		title: 'Shotgun for Business Purpose',
		slug: 'shotgun-business-purpose',
		image: '/images/courses/firearm-training.png',
		price: 2700,
		currency: 'ZAR',
		short_description: 'Firearm competency for shotgun use for business purposes.',
		category: 'Firearm',
		level: 'intermediate',
		features: ['Shotgun competency', 'Business purpose', 'Legal compliance']
	}
] as const;

export function formatZar(amount: number): string {
	return `R${amount.toLocaleString('en-ZA')}`;
}
