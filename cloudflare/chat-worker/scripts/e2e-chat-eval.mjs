/**
 * Live E2E eval against ProSiya Cloudflare chat Worker.
 * Usage: node scripts/e2e-chat-eval.mjs
 */
const API = process.env.CHAT_API_URL || 'https://prosiya-chat.tilesmirrored.workers.dev';
const DELAY_MS = Number(process.env.EVAL_DELAY_MS || 3500); // stay under 20/min

const CONTACT_RE = /(\+27\s?78\s?523\s?6606|078\s?523\s?6606|dladla\.siya@gmail\.com|whatsapp|30\s+wills)/i;
const HALLUCINATION_DATE_RE =
	/\b(starts?\s+on|next\s+(grade|intake|course).{0,40}\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}[\/\-]\d{1,2}|\d{4}))/i;
const HIRING_YES_RE =
	/\b(we\s+are\s+hiring|currently\s+hiring|yes[,.]?\s+we('re| are)\s+hiring|send\s+(us\s+)?your\s+cv|vacancies?\s+are\s+open|we\s+have\s+(openings|vacancies))\b/i;
const UNKNOWN_OK_RE =
	/\b(don'?t (currently )?have|do not have|not (currently )?(published|stated|available|verified)|enough information|contact prosiya|please contact)\b/i;

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

/** @type {Array<{id:number,category:string,lang:string,q:string,expect:string[],mustPrice?:string,mustLead?:string[],mustHandoff?:boolean}>} */
const CASES = [
	// 1 Security services
	{ id: 1, category: 'security', lang: 'en', q: 'What security services does ProSiya offer?', expect: ['services', 'contact_ok'] },
	{ id: 2, category: 'security', lang: 'en', q: 'Do you provide security guards?', expect: ['guarding'] },
	{ id: 3, category: 'security', lang: 'en', q: 'Do you provide armed response?', expect: ['armed'] },
	{ id: 4, category: 'security', lang: 'en', q: 'Do you provide security for businesses?', expect: ['services'] },
	{ id: 5, category: 'security', lang: 'en', q: 'Can you provide security guards for my warehouse?', expect: ['guarding', 'leadish'] },
	{ id: 6, category: 'security', lang: 'en', q: 'Do you provide security for construction sites?', expect: ['services'] },
	{ id: 7, category: 'security', lang: 'en', q: 'Do you provide security for factories?', expect: ['services'] },
	{ id: 8, category: 'security', lang: 'en', q: 'Do you offer VIP protection?', expect: ['vip'] },
	{ id: 9, category: 'security', lang: 'en', q: 'Do you offer mobile patrols?', expect: ['patrol'] },
	{ id: 10, category: 'security', lang: 'en', q: 'Do you provide private investigators?', expect: ['investigation'] },
	{ id: 11, category: 'security', lang: 'en', q: 'Can you provide security for an event?', expect: ['event'] },
	{ id: 12, category: 'security', lang: 'en', q: 'Do you provide escort services?', expect: ['escort'] },
	{ id: 13, category: 'security', lang: 'en', q: 'I need security for my business. Can you help me?', expect: ['leadish'] },
	{ id: 14, category: 'security', lang: 'en', q: 'What type of security would you recommend for my property?', expect: ['clarify_or_services'] },
	{ id: 15, category: 'security', lang: 'en', q: 'I need guards urgently. Can I speak to someone?', expect: ['handoff', 'contact'], mustHandoff: true },

	// isiZulu security samples
	{ id: 101, category: 'security', lang: 'zu', q: 'Yiziphi izinsizakalo zokuphepha ezinikezwa iProSiya?', expect: ['services'] },
	{ id: 102, category: 'security', lang: 'zu', q: 'Niyabahlinzeka onogada?', expect: ['guarding'] },
	{ id: 105, category: 'security', lang: 'zu', q: 'Ningangihlinzekela onogada bendawo yami yokugcina impahla?', expect: ['leadish'] },

	// 2 Training
	{ id: 16, category: 'training', lang: 'en', q: 'What security training courses do you offer?', expect: ['courses'] },
	{ id: 17, category: 'training', lang: 'en', q: 'Do you offer Grade C training?', expect: ['grade_c'] },
	{ id: 18, category: 'training', lang: 'en', q: 'Do you offer Grade B training?', expect: ['grade_b'] },
	{ id: 19, category: 'training', lang: 'en', q: 'Do you offer Grade A training?', expect: ['grade_a'] },
	{ id: 20, category: 'training', lang: 'en', q: 'Do you offer Grade D and E training?', expect: ['combined_or_de'] },
	{ id: 21, category: 'training', lang: 'en', q: 'How much is the combined Grade E, D and C course?', expect: ['price'], mustPrice: '1,950' },
	{ id: 22, category: 'training', lang: 'en', q: 'How much is Grade C training?', expect: ['price'], mustPrice: '1,050' },
	{ id: 23, category: 'training', lang: 'en', q: 'How much is Grade B training?', expect: ['price'], mustPrice: '1,500' },
	{ id: 24, category: 'training', lang: 'en', q: 'How much is Grade A training?', expect: ['price'], mustPrice: '1,500' },
	{ id: 25, category: 'training', lang: 'en', q: 'Do you offer Armed Response training?', expect: ['armed_train'] },
	{ id: 26, category: 'training', lang: 'en', q: 'Do you offer CIT training?', expect: ['cit'] },
	{ id: 27, category: 'training', lang: 'en', q: 'Do you offer CPO training?', expect: ['cpo'] },
	{ id: 28, category: 'training', lang: 'en', q: 'Do you offer firearm training?', expect: ['firearm'] },
	{ id: 29, category: 'training', lang: 'en', q: 'What firearm courses do you offer?', expect: ['firearm'] },
	{ id: 30, category: 'training', lang: 'en', q: 'I want to become a security officer. Which course should I take?', expect: ['courses', 'no_fake_legal'] },

	// 3 Prices & payments
	{ id: 31, category: 'prices', lang: 'en', q: 'How much does security training cost?', expect: ['price_list'] },
	{ id: 32, category: 'prices', lang: 'en', q: 'How much is Grade C?', expect: ['price'], mustPrice: '1,050' },
	{ id: 35, category: 'prices', lang: 'en', q: 'How much is Armed Response training?', expect: ['price'], mustPrice: '1,600' },
	{ id: 36, category: 'prices', lang: 'en', q: 'How much is the CPO course?', expect: ['price'], mustPrice: '16,750' },
	{ id: 37, category: 'prices', lang: 'en', q: 'How much is the CIT course?', expect: ['price'], mustPrice: '1,600' },
	{ id: 38, category: 'prices', lang: 'en', q: 'What payment methods do you accept?', expect: ['payment'] },
	{ id: 39, category: 'prices', lang: 'en', q: 'Can I pay using PayPal?', expect: ['paypal'] },
	{ id: 40, category: 'prices', lang: 'en', q: 'Where do I send my proof of payment?', expect: ['proof'] },

	// 4 Location & contact
	{ id: 41, category: 'contact', lang: 'en', q: 'Where is ProSiya located?', expect: ['address'] },
	{ id: 42, category: 'contact', lang: 'en', q: 'What is your address?', expect: ['address'] },
	{ id: 43, category: 'contact', lang: 'en', q: 'Are you based in Durban?', expect: ['durban'] },
	{ id: 44, category: 'contact', lang: 'en', q: 'What is your phone number?', expect: ['phone'] },
	{ id: 45, category: 'contact', lang: 'en', q: 'Can I WhatsApp ProSiya?', expect: ['whatsapp'] },
	{ id: 46, category: 'contact', lang: 'en', q: 'What is your email address?', expect: ['email'] },
	{ id: 47, category: 'contact', lang: 'en', q: 'How can I contact ProSiya?', expect: ['contact'] },
	{ id: 48, category: 'contact', lang: 'en', q: 'Can I speak directly to someone?', expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 50, category: 'contact', lang: 'en', q: 'What are your contact details?', expect: ['contact'] },

	// 5 Accreditation
	{ id: 51, category: 'accreditation', lang: 'en', q: 'Is ProSiya accredited?', expect: ['accreditation'] },
	{ id: 52, category: 'accreditation', lang: 'en', q: 'Which organisations accredit your training?', expect: ['accreditation'] },
	{ id: 53, category: 'accreditation', lang: 'en', q: 'Are your courses PSIRA related?', expect: ['psira'] },
	{ id: 54, category: 'accreditation', lang: 'en', q: 'Do you have QCTO accreditation?', expect: ['qcto'] },
	{ id: 55, category: 'accreditation', lang: 'en', q: 'Are you accredited by SASSETA?', expect: ['sasseta'] },
	{ id: 56, category: 'accreditation', lang: 'en', q: 'Do you have firearm accreditation?', expect: ['firearm_acc'] },
	{ id: 57, category: 'accreditation', lang: 'en', q: 'Do you have a SAPS badge?', expect: ['saps'] },
	{ id: 60, category: 'accreditation', lang: 'en', q: 'What accreditations does ProSiya have?', expect: ['accreditation'] },

	// 6 Employment — must NOT invent hiring
	{ id: 61, category: 'employment', lang: 'en', q: 'Are you hiring security guards?', expect: ['no_hiring_invent', 'contact'] },
	{ id: 62, category: 'employment', lang: 'en', q: 'Do you have any vacancies?', expect: ['no_hiring_invent', 'contact'] },
	{ id: 63, category: 'employment', lang: 'en', q: 'Can I apply for a security job?', expect: ['no_hiring_invent', 'contact'] },
	{ id: 65, category: 'employment', lang: 'en', q: 'I am looking for security work. Can you help me?', expect: ['no_hiring_invent', 'contact'] },
	{ id: 66, category: 'employment', lang: 'en', q: 'Where can I send my CV?', expect: ['no_hiring_invent', 'contact'] },
	{ id: 68, category: 'employment', lang: 'en', q: 'Do you employ people who have just completed security training?', expect: ['no_hiring_invent'] },
	{ id: 161, category: 'employment', lang: 'zu', q: 'Niyabaqasha onogada?', expect: ['no_hiring_invent', 'contact'] },

	// 7 Quotations / leads
	{ id: 69, category: 'quotes', lang: 'en', q: 'I need security guards for my company. Can I get a quote?', expect: ['quote_lead'], mustLead: ['service'] },
	{ id: 70, category: 'quotes', lang: 'en', q: 'How much would security cost for my business?', expect: ['no_fake_guard_price', 'quote_lead'] },
	{ id: 71, category: 'quotes', lang: 'en', q: 'I need two guards for my shop. How much will it cost?', expect: ['no_fake_guard_price', 'quote_lead'], mustLead: ['service'] },
	{ id: 72, category: 'quotes', lang: 'en', q: 'Can you quote me for security at my warehouse?', expect: ['quote_lead'], mustLead: ['service'] },
	{ id: 73, category: 'quotes', lang: 'en', q: 'I need security for a construction site.', expect: ['quote_lead'], mustLead: ['service'] },
	{ id: 75, category: 'quotes', lang: 'en', q: 'I need VIP protection. How do I get a quote?', expect: ['quote_lead', 'contact'], mustLead: ['service'] },
	{ id: 76, category: 'quotes', lang: 'en', q: 'Can someone contact me about security for my business?', expect: ['handoff', 'contact'], mustHandoff: true },
	{
		id: 200,
		category: 'quotes',
		lang: 'en',
		q: 'I need 4 guards for my shop in Durban',
		expect: ['quote_lead'],
		mustLead: ['service', 'location', 'requirements']
	},
	{
		id: 201,
		category: 'quotes',
		lang: 'zu',
		q: 'ngidinga onogada abangu 4 esitolo sami',
		expect: ['quote_lead'],
		mustLead: ['service', 'requirements']
	},

	// 8 Course dates — no invent
	{ id: 77, category: 'enrolment', lang: 'en', q: 'When does the next Grade C course start?', expect: ['no_fake_date', 'unknown_ok'] },
	{ id: 78, category: 'enrolment', lang: 'en', q: 'When is your next training intake?', expect: ['no_fake_date', 'unknown_ok'] },
	{ id: 79, category: 'enrolment', lang: 'en', q: 'How do I register for training?', expect: ['enrol_ok'] },
	{ id: 82, category: 'enrolment', lang: 'en', q: 'What documents do I need to register?', expect: ['unknown_ok', 'contact'] },
	{ id: 83, category: 'enrolment', lang: 'en', q: 'How long does the training take?', expect: ['unknown_ok', 'no_fake_duration'] },
	{ id: 84, category: 'enrolment', lang: 'en', q: 'Where does the training take place?', expect: ['unknown_or_durban_careful'] },

	// 9 Handoff
	{ id: 85, category: 'handoff', lang: 'en', q: 'Can I speak to a real person?', expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 86, category: 'handoff', lang: 'en', q: "I don't want to speak to a chatbot. Can someone help me?", expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 87, category: 'handoff', lang: 'en', q: 'Can someone from ProSiya call me?', expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 88, category: 'handoff', lang: 'en', q: 'I have a complicated security requirement. Who can I speak to?', expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 90, category: 'handoff', lang: 'en', q: 'I need to speak to management.', expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 91, category: 'handoff', lang: 'en', q: 'Can I contact Siyabonga Dladla?', expect: ['handoff', 'contact'] },
	{ id: 92, category: 'handoff', lang: 'en', q: 'Please have someone contact me about security services.', expect: ['handoff', 'contact'], mustHandoff: true },

	// 10 Do not guess
	{ id: 93, category: 'no_guess', lang: 'en', q: 'When exactly is the next Grade C class?', expect: ['no_fake_date', 'unknown_ok'] },
	{ id: 94, category: 'no_guess', lang: 'en', q: 'How many security guards does ProSiya currently employ?', expect: ['unknown_ok'] },
	{ id: 95, category: 'no_guess', lang: 'en', q: 'Is ProSiya currently hiring in Johannesburg?', expect: ['no_hiring_invent', 'unknown_ok'] },
	{ id: 96, category: 'no_guess', lang: 'en', q: 'How much does security for a 500 m² warehouse cost?', expect: ['no_fake_guard_price', 'quote_lead'] },
	{ id: 97, category: 'no_guess', lang: 'en', q: 'How long does each course take?', expect: ['unknown_ok', 'no_fake_duration'] },
	{ id: 98, category: 'no_guess', lang: 'en', q: 'Do you have offices in Johannesburg?', expect: ['no_jhb_office'] },
	{ id: 99, category: 'no_guess', lang: 'en', q: 'What are your current job vacancies?', expect: ['no_hiring_invent', 'unknown_ok'] },
	{ id: 100, category: 'no_guess', lang: 'en', q: 'Can you guarantee that I will get a security job after training?', expect: ['no_job_guarantee'] },

	// Informal SA
	{ id: 301, category: 'informal', lang: 'en', q: 'hi how much grade c', expect: ['price'], mustPrice: '1,050' },
	{ id: 302, category: 'informal', lang: 'zu', q: 'ngifuna grade c', expect: ['grade_c'] },
	{ id: 303, category: 'informal', lang: 'zu', q: 'nina niqasha?', expect: ['no_hiring_invent'] },
	{ id: 304, category: 'informal', lang: 'en', q: 'price ye grade b?', expect: ['price'], mustPrice: '1,500' },
	{ id: 305, category: 'informal', lang: 'en', q: 'where u guys based', expect: ['address'] },
	{ id: 306, category: 'informal', lang: 'en', q: 'do u guys have whatsapp', expect: ['whatsapp'] },
	{ id: 307, category: 'informal', lang: 'en', q: 'how much for armed response', expect: ['price'], mustPrice: '1,600' },
	{ id: 308, category: 'informal', lang: 'en', q: 'do u guys train for guns', expect: ['firearm'] },
	{ id: 309, category: 'informal', lang: 'zu', q: 'ngifuna umsebenzi', expect: ['no_hiring_invent', 'contact'] },
	{ id: 310, category: 'informal', lang: 'en', q: 'can someone call me', expect: ['handoff', 'contact'], mustHandoff: true },
	{ id: 311, category: 'informal', lang: 'zu', q: 'ngicela umuntu angishayele', expect: ['handoff', 'contact'], mustHandoff: true }
];

function includesAny(text, needles) {
	const t = text.toLowerCase();
	return needles.some((n) => t.includes(n.toLowerCase()));
}

function scoreCase(c, data) {
	const msg = data?.message || '';
	const lead = data?.lead || null;
	const handoff = !!data?.handoffSuggested;
	const fails = [];
	const passes = [];

	const checks = {
		services: () => includesAny(msg, ['guard', 'patrol', 'vip', 'armed', 'investigation', 'escort', 'event', 'loss']),
		guarding: () => includesAny(msg, ['guard', 'physical guarding', 'onogada', 'nogada']),
		armed: () => includesAny(msg, ['armed response']),
		vip: () => includesAny(msg, ['vip', 'close protection']),
		patrol: () => includesAny(msg, ['patrol']),
		investigation: () => includesAny(msg, ['investigation', 'investigator']),
		event: () => includesAny(msg, ['event']),
		escort: () => includesAny(msg, ['escort']),
		leadish: () =>
			!!lead?.service ||
			includesAny(msg, ['location', 'site', 'quote', 'contact', 'whatsapp', 'phone', 'tell me', 'details']),
		clarify_or_services: () =>
			includesAny(msg, ['guard', 'patrol', 'vip', 'armed', 'what type', 'property', 'site', 'tell me']),
		handoff: () => handoff || CONTACT_RE.test(msg),
		contact: () => CONTACT_RE.test(msg),
		contact_ok: () => true,
		courses: () => includesAny(msg, ['grade', 'course', 'training', 'cpo', 'cit', 'firearm']),
		grade_c: () => includesAny(msg, ['grade c', '1,050', '1050']),
		grade_b: () => includesAny(msg, ['grade b', '1,500', '1500']),
		grade_a: () => includesAny(msg, ['grade a', '1,500', '1500']),
		combined_or_de: () => includesAny(msg, ['grade e', 'grade d', 'combined', '1,950', '1950']),
		price: () => true, // enforced by mustPrice
		price_list: () => includesAny(msg, ['1,050', '1,500', '1,950', 'grade']),
		armed_train: () => includesAny(msg, ['armed response', '1,600', '1600']),
		cit: () => includesAny(msg, ['cit', 'cash-in-transit', '1,600']),
		cpo: () => includesAny(msg, ['cpo', 'close protection', '16,750']),
		firearm: () => includesAny(msg, ['handgun', 'rifle', 'shotgun', 'firearm']),
		no_fake_legal: () => !/\b(legally required|must take grade|law requires)\b/i.test(msg),
		payment: () => includesAny(msg, ['paypal', 'proof', 'whatsapp', 'eft', 'payment']),
		paypal: () => includesAny(msg, ['paypal', 'dladla.siya@gmail.com']),
		proof: () => includesAny(msg, ['whatsapp', '+27', '078', 'proof']),
		address: () => includesAny(msg, ['wills', 'durban', '4001']),
		durban: () => includesAny(msg, ['durban', 'thekwini', 'wills']),
		phone: () => /(\+27\s?78\s?523\s?6606|078\s?523\s?6606)/i.test(msg),
		whatsapp: () => includesAny(msg, ['whatsapp', '+27', '078']),
		email: () => includesAny(msg, ['dladla.siya@gmail.com']),
		accreditation: () => includesAny(msg, ['psira', 'qcto', 'sasseta', 'saps', 'firearm']),
		psira: () => includesAny(msg, ['psira']),
		qcto: () => includesAny(msg, ['qcto']),
		sasseta: () => includesAny(msg, ['sasseta']),
		firearm_acc: () => includesAny(msg, ['firearm']),
		saps: () => includesAny(msg, ['saps']),
		no_hiring_invent: () => !HIRING_YES_RE.test(msg),
		quote_lead: () =>
			!!lead?.service ||
			includesAny(msg, ['quote', 'quotation', 'contact', 'location', 'site', 'details', 'whatsapp', 'phone']),
		no_fake_guard_price: () =>
			!/\b(r\s?\d{2,}|ZAR\s?\d{2,}).{0,30}(per\s+(guard|month|day)|for\s+(two|2|four|4)\s+guards)/i.test(msg),
		no_fake_date: () => !HALLUCINATION_DATE_RE.test(msg),
		no_fake_duration: () => !/\b(\d+\s*(days?|weeks?|months?)\s+(long|duration|course)|course\s+takes\s+\d+)/i.test(msg),
		unknown_ok: () => UNKNOWN_OK_RE.test(msg) || CONTACT_RE.test(msg),
		enrol_ok: () => includesAny(msg, ['enrol', 'enroll', 'register', 'website', 'account', 'contact']),
		unknown_or_durban_careful: () =>
			UNKNOWN_OK_RE.test(msg) || (includesAny(msg, ['durban', 'wills']) && !includesAny(msg, ['training is held at', 'classes are at'])),
		no_jhb_office: () => !/\b(yes[,.]?\s+we have (an )?office|our johannesburg office|we are (also )?in johannesburg)\b/i.test(msg),
		no_job_guarantee: () => !/\b(guarantee|guaranteed|sure you will get a job|promise.*job)\b/i.test(msg)
	};

	for (const key of c.expect) {
		const fn = checks[key];
		if (!fn) continue;
		if (fn()) passes.push(key);
		else fails.push(key);
	}

	if (c.mustPrice) {
		const ok =
			msg.includes(c.mustPrice) ||
			msg.replace(/,/g, '').includes(c.mustPrice.replace(/,/g, '')) ||
			msg.includes(`R${c.mustPrice}`) ||
			msg.includes(`R ${c.mustPrice}`);
		if (ok) passes.push(`price:${c.mustPrice}`);
		else fails.push(`price:${c.mustPrice}`);
	}

	if (c.mustLead) {
		for (const field of c.mustLead) {
			if (lead && lead[field]) passes.push(`lead.${field}`);
			else fails.push(`lead.${field}`);
		}
	}

	if (c.mustHandoff) {
		if (handoff || CONTACT_RE.test(msg)) passes.push('handoffSuggested');
		else fails.push('handoffSuggested');
	}

	const pass = fails.length === 0;
	return { pass, passes, fails, handoff, lead };
}

async function ask(message) {
	const res = await fetch(API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Origin: 'https://www.prosiyagroup.co.za'
		},
		body: JSON.stringify({ message, history: [], conversationId: null })
	});
	const text = await res.text();
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		data = { error: text };
	}
	return { status: res.status, data };
}

async function main() {
	const results = [];
	console.log(`Running ${CASES.length} cases against ${API}`);
	for (let i = 0; i < CASES.length; i++) {
		const c = CASES[i];
		process.stdout.write(`[${i + 1}/${CASES.length}] #${c.id} ${c.category}... `);
		try {
			const { status, data } = await ask(c.q);
			if (status !== 200 || !data?.message) {
				results.push({
					...c,
					pass: false,
					status,
					message: data?.message || data?.error || 'no message',
					fails: ['http_or_empty'],
					passes: [],
					lead: data?.lead || null,
					handoffSuggested: !!data?.handoffSuggested
				});
				console.log('FAIL status', status);
			} else {
				const scored = scoreCase(c, data);
				results.push({
					id: c.id,
					category: c.category,
					lang: c.lang,
					q: c.q,
					pass: scored.pass,
					message: data.message,
					lead: scored.lead,
					handoffSuggested: scored.handoff,
					passes: scored.passes,
					fails: scored.fails,
					status
				});
				console.log(scored.pass ? 'PASS' : `FAIL (${scored.fails.join(',')})`);
			}
		} catch (err) {
			results.push({
				...c,
				pass: false,
				message: String(err),
				fails: ['exception'],
				passes: [],
				lead: null,
				handoffSuggested: false,
				status: 0
			});
			console.log('ERR', err.message || err);
		}
		if (i < CASES.length - 1) await sleep(DELAY_MS);
	}

	const byCat = {};
	for (const r of results) {
		byCat[r.category] ||= { pass: 0, fail: 0, total: 0 };
		byCat[r.category].total++;
		if (r.pass) byCat[r.category].pass++;
		else byCat[r.category].fail++;
	}
	const summary = {
		api: API,
		ranAt: new Date().toISOString(),
		total: results.length,
		passed: results.filter((r) => r.pass).length,
		failed: results.filter((r) => !r.pass).length,
		byCategory: byCat,
		failures: results.filter((r) => !r.pass).map((r) => ({
			id: r.id,
			category: r.category,
			q: r.q,
			fails: r.fails,
			message: (r.message || '').slice(0, 280),
			lead: r.lead
		})),
		results
	};

	const outPath = new URL('./e2e-chat-eval-results.json', import.meta.url);
	const fs = await import('fs');
	fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
	console.log('\nSUMMARY', {
		passed: summary.passed,
		failed: summary.failed,
		total: summary.total,
		byCategory: byCat
	});
	console.log('Wrote', outPath.pathname);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
