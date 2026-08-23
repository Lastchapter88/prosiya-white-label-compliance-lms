/** Official ProSiya Group contact details — used across company profile pages. */
export const companyContact = {
	phone: '+27 78 523 6606',
	phoneTel: '+27785236606',
	email: 'dladla.siya@gmail.com',
	streetAddress: '30 Wills Road',
	city: 'Durban',
	postalCode: '4001',
	country: 'South Africa',
	fullAddress: '30 Wills Road, Durban, 4001'
} as const;

/** Course payment and proof-of-payment instructions for learners. */
export const paymentDetails = {
	proofOfPaymentPhone: companyContact.phone,
	proofOfPaymentTel: companyContact.phoneTel,
	whatsAppProofUrl:
		'https://wa.me/27785236606?text=' +
		encodeURIComponent(
			'Hello ProSiya Academy, I would like to send proof of payment for my course enrollment.'
		),
	paypalEmail: 'dladla.siya@gmail.com',
	paypalMailto:
		'mailto:dladla.siya@gmail.com?subject=' +
		encodeURIComponent('ProSiya Course Payment')
} as const;

export const companyOverview = {
	tagline: 'Security and Training',
	positioning:
		'ProSiya Group Security and Training is a leading South African organisation specialising in integrated security solutions. Proudly 100% private black-owned, we combine professional guarding services with accredited training for the security industry.',
	context:
		'Through extensive field experience, we understand the security challenges facing businesses and communities in South Africa. We address those challenges with tailored services and training that meet real operational needs.'
} as const;

export const missionVisionValues = {
	mission: [
		'Provide exceptional value to our clients, the market, and the communities we serve.',
		'Empower our employees to reach their full potential.',
		'Transform the image of the security sector in South Africa through professionalism and integrity.'
	],
	vision:
		'To cultivate deep specialisation across a broad spectrum of security services and products, enhance the African security industry, and deliver competitive solutions for evolving sector needs.',
	values: [
		{
			title: 'Customer-driven solutions',
			description:
				'We design integrated security solutions tailored to each client by combining the right mix of services and products for every challenge.'
		},
		{
			title: 'Professionalism & integrity',
			description:
				'We hold ourselves to the highest standards in how we serve clients, develop staff, and represent the security industry.'
		}
	]
} as const;

export const staffStandards = {
	intro:
		'To uphold integrity and professionalism, our personnel meet rigorous screening and ongoing development requirements.',
	points: [
		'Polygraph, criminal background, and credit screening for client-facing roles',
		'Regular on-site orientations and annual compliance training',
		'Continuous skills development to maintain accreditation and service quality'
	]
} as const;

/** Operational security services — separate from LMS training courses. */
export const securityServices = [
	{ title: 'Physical Guarding', description: 'On-site security personnel to protect properties and assets.' },
	{ title: 'Loss Prevention', description: 'Strategies and measures to prevent theft and reduce losses.' },
	{ title: 'VIP Protection', description: 'Specialised close protection for high-profile individuals.' },
	{ title: 'Mobile Patrols', description: 'Vehicle patrols to deter incidents and respond quickly.' },
	{ title: 'Private Investigation', description: 'Discreet investigations to gather information and evidence.' },
	{ title: 'Special Events', description: 'Event security tailored to keep guests safe and operations orderly.' },
	{ title: 'Escorting', description: 'Safe transport for people or valuables.' },
	{ title: 'Armed Response', description: 'Rapid armed response to security threats and alarms.' }
] as const;

export const managementTeam = [
	{
		name: 'Siyabonga Dladla',
		role: 'Managing Director',
		bio:
			'With 18 years of experience in the security industry, Siyabonga Dladla leads ProSiya Group with deep expertise in security training and operations. His background includes accredited firearm and security instruction and assessment.'
	}
] as const;
