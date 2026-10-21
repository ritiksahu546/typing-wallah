import { ExamId, ExamInfo } from '../types';

export const EXAMS_DATA: Record<ExamId, ExamInfo> = {
  cpct: {
    id: 'cpct',
    name: 'MP CPCT',
    fullName: 'Madhya Pradesh Computer Proficiency Certification Test',
    shortTag: 'CPCT Exam',
    slug: 'mp-cpct',
    conductedBy: 'MAP_IT, Government of Madhya Pradesh',
    category: 'state_gov',
    state: 'Madhya Pradesh',
    posts: [
      'Assistant Grade-3 (AG-3)',
      'Data Entry Operator (DEO)',
      'Steno Typist',
      'Computer Operator',
      'Revenue Inspector Clerk',
      'District Collectorate Ministerial Cadre'
    ],
    typingRequired: true,
    skillTestType: 'Computer Typing Test (English & Hindi)',
    overview:
      'CPCT is mandatory for clerical, data entry, and assistant grade-3 appointments in Madhya Pradesh government departments and autonomous agencies. It evaluates computer proficiency via MCQ along with English and Hindi typing speeds in realistic simulated conditions.',
    qualifyingHindiWpm: 20,
    qualifyingEnglishWpm: 30,
    durationMinutes: 15,
    accuracyRequirement: 'Net Speed evaluated after subtracting penalty for excessive errors (min 80% accuracy recommended)',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Net WPM = (Total Gross Words - Penalty Deduction) / Duration in Minutes',
    passageType: 'State Governance, e-District Schemes, Revenue Administration',
    freeOrPro: 'free',
    officialSource: 'https://cpct.mp.gov.in',
    notificationDate: '2024-01-15',
    lastVerified: '2025-01-10',
    status: 'Active',
    patternSummary: [
      'English Typing: 15 Minutes duration, target speed minimum 30 WPM',
      'Hindi Typing: 15 Minutes duration, target speed minimum 20 WPM',
      'Keyboard Layouts: Remington GAIL and InScript (Mangal Unicode font)',
      'Official trial mock session of 10 minutes precedes actual test',
      'Scorecard valid as per MP General Administration Department (GAD) circulars'
    ],
    instructions: [
      'Ensure hands are positioned in standard home-row posture before beginning.',
      'In CPCT Hindi, ensure your chosen layout (Remington GAIL or InScript) is correctly selected.',
      'Backspace is enabled in CPCT official exam software to correct inadvertent errors.',
      'Score grades: 50+ WPM (A+ Grade), 40-49 WPM (A Grade), 30-39 WPM (B Grade), 20-29 WPM (C Grade).'
    ],
    faqs: [
      {
        question: 'What is the qualifying typing speed for MP CPCT?',
        answer: 'Candidates must achieve a minimum of 30 Net WPM in English typing and 20 Net WPM in Hindi typing to qualify respective sections.'
      },
      {
        question: 'Which Hindi keyboard layout is used in CPCT exam?',
        answer: 'CPCT officially supports both Remington GAIL and InScript layouts on Mangal font. Candidates choose their preferred layout during the mock test phase.'
      },
      {
        question: 'Is backspace allowed in the actual CPCT typing test?',
        answer: 'Yes, backspace is allowed in official CPCT software to correct keystrokes within the current text.'
      }
    ],
    relatedExams: ['high-court', 'state-gov', 'ssc-chsl']
  },

  'ssc-chsl': {
    id: 'ssc-chsl',
    name: 'SSC CHSL',
    fullName: 'Staff Selection Commission Combined Higher Secondary Level (Tier II / Typing Test)',
    shortTag: 'SSC CHSL',
    slug: 'ssc-chsl',
    conductedBy: 'Staff Selection Commission (SSC)',
    category: 'central_gov',
    state: 'All India',
    posts: [
      'Lower Division Clerk (LDC)',
      'Junior Secretariat Assistant (JSA)',
      'Data Entry Operator (DEO Grade A)'
    ],
    typingRequired: true,
    skillTestType: 'Typing Test / DEST',
    overview:
      'SSC CHSL typing test evaluates candidates shortlisted for LDC, JSA, and DEO across Central Ministries, Attached Offices, and Constitutional Commissions. Conducted strictly on computerized master passage software.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 35,
    keyDepressionsTarget: 1750,
    durationMinutes: 10,
    accuracyRequirement: 'Maximum 7% errors allowed for UR; up to 10% errors allowed for Reserved categories',
    allowedErrorPercent: 7,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Mistake Percentage = (Total Full Mistakes + Half Mistakes * 0.5) / Total Target Words * 100',
    passageType: 'Administrative Proceedings, Socio-Economic Policy, General Knowledge',
    freeOrPro: 'free',
    officialSource: 'https://ssc.gov.in',
    notificationDate: '2024-04-08',
    lastVerified: '2025-01-12',
    status: 'Active',
    patternSummary: [
      'English Medium: 35 WPM (approx. 10,500 KDPH / 1,750 key depressions in 10 minutes)',
      'Hindi Medium: 30 WPM (approx. 9,000 KDPH / 1,500 key depressions in 10 minutes)',
      'Duration: 10 Minutes (15 minutes for eligible PwD/VH candidates with scribe)',
      'Evaluation strictly enforces full and half mistake penalty equations'
    ],
    instructions: [
      'Maintain an even typing cadence to avoid cluster errors near punctuation marks.',
      'Omissions or substitutions of whole words count as Full Mistakes.',
      'Spelling inaccuracies or capitalization mismatches count as Half Mistakes.',
      'Do not hit enter unnecessarily unless a paragraph break is indicated.'
    ],
    faqs: [
      {
        question: 'What is the speed requirement for SSC CHSL English Typing?',
        answer: '35 words per minute in English, corresponding to approx. 1,750 key depressions within 10 minutes.'
      },
      {
        question: 'What is the permissible error percentage in SSC CHSL?',
        answer: 'Generally up to 7% for Unreserved (UR) category and up to 10% for reserved categories (OBC/SC/ST/EWS).'
      }
    ],
    relatedExams: ['ssc-cgl-dest', 'rrb-ntpc', 'delhi-police-hcm']
  },

  'ssc-cgl-dest': {
    id: 'ssc-cgl-dest',
    name: 'SSC CGL DEST',
    fullName: 'SSC Combined Graduate Level Data Entry Skill Test (DEST)',
    shortTag: 'CGL DEST',
    slug: 'ssc-cgl-dest',
    conductedBy: 'Staff Selection Commission (SSC)',
    category: 'central_gov',
    state: 'All India',
    posts: [
      'Tax Assistant (CBDT - Direct Taxes)',
      'Tax Assistant (CBIC - Indirect Taxes & Customs)',
      'Executive Assistant',
      'Inspector of Posts',
      'Auditor & Accountant posts requiring DEST'
    ],
    typingRequired: true,
    skillTestType: 'Data Entry Speed Test (DEST)',
    overview:
      'DEST is conducted by SSC for various Central Government posts including Tax Assistant (CBIC/CBDT), Executive Assistant, and others requiring rigorous continuous keyboard input accuracy.',
    qualifyingEnglishWpm: 27,
    keyDepressionsTarget: 2000,
    durationMinutes: 15,
    accuracyRequirement: 'Maximum 5% to 7% error cutoff depending on post notification and category',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard'],
    scoringMethod: 'Key Depressions Per Hour (KDPH) minimum 8,000 with under 5% mistake ratio',
    passageType: 'Fiscal Policy, Corporate Governance, Revenue Ledgers, Infrastructure',
    freeOrPro: 'free',
    officialSource: 'https://ssc.gov.in',
    notificationDate: '2024-06-24',
    lastVerified: '2025-01-14',
    status: 'Active',
    patternSummary: [
      'Duration: 15 Minutes test session',
      'Target: 2,000 Key Depressions (approx. 8,000 KDPH / ~27 WPM)',
      'Conducted on computer screens with on-screen master passage',
      'Strict error calculation based on word substitutions and omitted characters'
    ],
    instructions: [
      'Key to CGL DEST is zero omitted lines; track your current word continuously.',
      'Complete the passage accurately before attempting to re-type or edit earlier text.',
      'Pay special attention to numerical figures, brackets, and alphanumeric codes.'
    ],
    faqs: [
      {
        question: 'How many key depressions are required in SSC CGL DEST?',
        answer: '2,000 key depressions within 15 minutes, equivalent to 8,000 key depressions per hour.'
      },
      {
        question: 'Is DEST mandatory for all SSC CGL posts?',
        answer: 'DEST is mandatory for all posts where typing/data entry skill is explicitly prescribed in the recruitment notice, such as Tax Assistant.'
      }
    ],
    relatedExams: ['ssc-chsl', 'rrb-ntpc']
  },

  'ssc-selection-post': {
    id: 'ssc-selection-post',
    name: 'SSC Selection Post',
    fullName: 'SSC Selection Posts (Phase Examinations) Skill Test',
    shortTag: 'Selection Post',
    slug: 'ssc-selection-post',
    conductedBy: 'Staff Selection Commission (SSC)',
    category: 'central_gov',
    state: 'All India',
    posts: [
      'Junior Computer Assistant',
      'Data Entry Operator Grade B',
      'Clerk-cum-Typist (Autonomous Laboratories & Bureaus)',
      'Store Keeper & Office Assistant'
    ],
    typingRequired: true,
    skillTestType: 'Typing Test / Skill Test',
    overview:
      'SSC Selection Posts include departmental posts across diverse Central Government organizations where skill/typing tests are prescribed as mandatory qualifying criteria.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 35,
    keyDepressionsTarget: 1750,
    durationMinutes: 10,
    accuracyRequirement: '7% for UR, 10% for Reserved categories',
    allowedErrorPercent: 7,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Mistake Percentage against target passage length',
    passageType: 'Scientific Reports, Departmental Bulletins, Administrative Rules',
    freeOrPro: 'pro',
    officialSource: 'https://ssc.gov.in',
    notificationDate: '2024-02-26',
    lastVerified: '2025-01-08',
    status: 'Active',
    patternSummary: [
      'English 35 WPM / Hindi 30 WPM for 10 minutes',
      'Post-specific speed requirements as per regional recruitment annexures',
      'Conducted at designated SSC regional computer centers'
    ],
    instructions: [
      'Review your post-specific qualification notice for language options.',
      'Maintain rhythm across technical terms and formal citations.'
    ],
    faqs: [
      {
        question: 'Is typing required for every SSC Selection Post?',
        answer: 'No. Only specific posts (such as Data Entry Operator or Clerk-cum-Typist) explicitly stipulate typing tests in their recruitment rules.'
      }
    ],
    relatedExams: ['ssc-chsl', 'ssc-cgl-dest']
  },

  'ssc-steno': {
    id: 'ssc-steno',
    name: 'SSC Stenographer',
    fullName: 'SSC Stenographer Grade C & D Skill Test (Computer Transcription)',
    shortTag: 'SSC Steno',
    slug: 'ssc-steno',
    conductedBy: 'Staff Selection Commission (SSC)',
    category: 'central_gov',
    state: 'All India',
    posts: [
      'Stenographer Grade C (Ministries & Secretariats)',
      'Stenographer Grade D (Subordinate Offices)'
    ],
    typingRequired: true,
    skillTestType: 'Shorthand Transcription on Computer',
    overview:
      'Evaluates candidates on shorthand dictation followed by transcription on computer keyboards within stipulated time limits with permissible error thresholds.',
    qualifyingHindiWpm: 25,
    qualifyingEnglishWpm: 30,
    durationMinutes: 50,
    accuracyRequirement: 'Maximum 5% mistakes for Grade C UR; 7% for Grade D UR',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Evaluation based on percentage of transcription errors from master speech',
    passageType: 'Parliamentary Debates, Editorial Articles, Official Speeches',
    freeOrPro: 'pro',
    officialSource: 'https://ssc.gov.in',
    notificationDate: '2024-07-26',
    lastVerified: '2025-01-11',
    status: 'Active',
    patternSummary: [
      'Transcription time: 50 mins (English Grade D), 40 mins (English Grade C)',
      'Hindi transcription: 65 mins (Grade D), 55 mins (Grade C)',
      'Dictation given at 100 WPM (Grade C) or 80 WPM (Grade D) for 10 mins'
    ],
    instructions: [
      'Transcription must strictly match audio dictation without omissions.',
      'Check spellings of proper nouns, dates, and constitutional terms.'
    ],
    faqs: [
      {
        question: 'What is the permissible mistake limit in SSC Steno?',
        answer: '5% to 7% for UR candidates depending on Grade C or Grade D classifications.'
      }
    ],
    relatedExams: ['ssc-chsl', 'high-court']
  },

  'rrb-ntpc': {
    id: 'rrb-ntpc',
    name: 'RRB NTPC Typing',
    fullName: 'Railway Recruitment Board NTPC Typing Skill Test (TST)',
    shortTag: 'RRB NTPC',
    slug: 'rrb-ntpc',
    conductedBy: 'Railway Recruitment Boards (Ministry of Railways)',
    category: 'railways',
    state: 'All India',
    posts: [
      'Junior Clerk cum Typist',
      'Accounts Clerk cum Typist',
      'Senior Clerk cum Typist',
      'Junior Time Keeper',
      'Senior Time Keeper'
    ],
    typingRequired: true,
    skillTestType: 'Typing Skill Test (TST)',
    overview:
      'Conducted for non-technical popular category clerical posts in Indian Railways. Evaluation uses an official penalty formula where 5% mistakes are ignored and remaining mistakes carry a 10-word penalty deduction from gross words typed.',
    qualifyingHindiWpm: 25,
    qualifyingEnglishWpm: 30,
    durationMinutes: 10,
    accuracyRequirement: 'Official Formula: 5% mistakes ignored, remaining mistakes * 10 deducted from total words typed',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Net WPM = (Total Typed Words - (Penalty Mistakes * 10)) / 10',
    passageType: 'Railway Logistics, Passenger Safety, Track Operations, Modernization',
    freeOrPro: 'free',
    officialSource: 'https://rrbcdg.gov.in',
    notificationDate: '2024-09-14',
    lastVerified: '2025-01-10',
    status: 'Active',
    patternSummary: [
      'English Medium: 30 WPM minimum net speed',
      'Hindi Medium: 25 WPM minimum net speed (KrutiDev / Mangal InScript / Remington)',
      'Duration: 10 Minutes continuous typing',
      'Formula: Net Words = Gross Words - (Mistakes exceeding 5% * 10)'
    ],
    instructions: [
      'Do not stop typing even if an error is made; speed volume helps offset isolated mistakes.',
      'Under the 10x penalty rule, each mistake beyond 5% reduces your net word count by 10 words.',
      'If you complete the passage before 10 minutes, restart typing from the beginning after pressing Space.'
    ],
    faqs: [
      {
        question: 'What is the RRB NTPC mistake penalty formula?',
        answer: '5% of total words typed are ignored as permissible errors. For every additional error, 10 words are deducted from gross words before dividing by 10 minutes.'
      },
      {
        question: 'Is Hindi typing allowed on KrutiDev in RRB NTPC?',
        answer: 'RRB official guidelines specify Mangal (InScript / Remington) as standard unicode layouts, while some centers have historically provided KrutiDev.'
      }
    ],
    relatedExams: ['ssc-chsl', 'cpct']
  },

  'delhi-police-hcm': {
    id: 'delhi-police-hcm',
    name: 'Delhi Police HCM',
    fullName: 'Delhi Police Head Constable (Ministerial) Typing Test',
    shortTag: 'DP HCM',
    slug: 'delhi-police-hcm',
    conductedBy: 'Delhi Police & SSC',
    category: 'delhi',
    state: 'Delhi',
    posts: [
      'Head Constable (Ministerial) in Delhi Police'
    ],
    typingRequired: true,
    skillTestType: 'Typing Speed Test (Scored out of 25 Marks)',
    overview:
      'Evaluates shortlisted candidates for ministerial clerical postings in Delhi Police. Unlike purely qualifying exams, typing speed in Delhi Police HCM awards merit marks up to 25 marks based on speed brackets.',
    qualifyingHindiWpm: 25,
    qualifyingEnglishWpm: 30,
    durationMinutes: 10,
    accuracyRequirement: 'Max 25 Marks awarded based on achieved Net Speed brackets (30 WPM to 50+ WPM)',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Marks system: 30 WPM = 10 Marks, 35 WPM = 12 Marks, 40 WPM = 15 Marks, 45 WPM = 18 Marks, 50+ WPM = 25 Marks',
    passageType: 'Police Administration, Cyber Crime Prevention, Law & Order, Public Safety',
    freeOrPro: 'free',
    officialSource: 'https://delhipolice.gov.in',
    notificationDate: '2023-11-20',
    lastVerified: '2025-01-05',
    status: 'Active',
    patternSummary: [
      'English: 30 WPM minimum for 10 marks (50+ WPM for maximum 25 marks)',
      'Hindi: 25 WPM minimum for 10 marks',
      'Test Duration: 10 Minutes',
      'Marks are added to the final merit compilation'
    ],
    instructions: [
      'Aim for 50+ Net WPM to secure maximum 25 merit marks in final selection.',
      'Exercise caution with numerical details and acronyms frequently seen in police passages.'
    ],
    faqs: [
      {
        question: 'Are marks awarded for typing test in Delhi Police HCM?',
        answer: 'Yes, up to 25 marks are awarded based on candidate Net WPM performance brackets.'
      }
    ],
    relatedExams: ['ssc-chsl', 'dsssb']
  },

  'high-court': {
    id: 'high-court',
    name: 'High Court & District Courts',
    fullName: 'High Court & Subordinate District Courts Assistant / Typist Examination',
    shortTag: 'High Court',
    slug: 'high-court-clerk',
    conductedBy: 'High Court Recruitment Cells (MP, Allahabad, Rajasthan, Bombay, Patna)',
    category: 'courts',
    state: 'Multi-State',
    posts: [
      'Junior Judicial Assistant (JJA)',
      'Clerk-cum-Typist',
      'Assistant Grade-3 (Judiciary)',
      'Court Reader & Typist',
      'Stenographer Grade-III'
    ],
    typingRequired: true,
    skillTestType: 'Legal Passage Typing Test',
    overview:
      'High Courts and District Sessions Courts conduct rigorous typing examinations evaluating legal vocabulary, statutory provisions, and extempore court dictation. Strict backspace and accuracy cutoffs are enforced.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 35,
    durationMinutes: 10,
    accuracyRequirement: 'Strict error deduction (often 0.5 marks deducted per error or backspace disabled in official halls)',
    allowedErrorPercent: 3,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Deduction of marks for spelling, punctuation, and formatting inaccuracies',
    passageType: 'Constitutional Law, Civil Procedure, Criminal Trial Judgments, Latin Maxims',
    freeOrPro: 'free',
    officialSource: 'https://mphc.gov.in / https://allahabadhighcourt.in',
    notificationDate: '2024-03-12',
    lastVerified: '2025-01-13',
    status: 'Active',
    patternSummary: [
      'English: 35-40 WPM on specialized judicial passages',
      'Hindi: 30-35 WPM on Mangal / Remington GAIL or KrutiDev font',
      'Duration: 5 to 10 Minutes depending on the specific High Court rule book',
      'High weightage placed on correct legal terminology and citations'
    ],
    instructions: [
      'Pay close attention to Latin legal maxims (e.g. prima facie, ultra vires, habeas corpus).',
      'Do not substitute legal terms with common synonyms.',
      'Practice with backspace restriction enabled to prepare for strict judicial exam halls.'
    ],
    faqs: [
      {
        question: 'Which Hindi font is used in Allahabad and MP High Court?',
        answer: 'MP High Court predominantly utilizes Remington GAIL (Mangal Unicode), while Allahabad HC has officially supported InScript and KrutiDev.'
      }
    ],
    relatedExams: ['supreme-court-jca', 'cpct', 'upsssc']
  },

  'patna-hc': {
    id: 'patna-hc',
    name: 'Patna High Court',
    fullName: 'Patna High Court Assistant & Computer Operator-cum-Typist Skill Test',
    shortTag: 'Patna HC',
    slug: 'patna-high-court',
    conductedBy: 'High Court of Judicature at Patna',
    category: 'courts',
    state: 'Bihar',
    posts: [
      'Assistant (Group-B)',
      'Computer Operator-cum-Typist',
      'Court Reader-cum-Deposition Writer',
      'Stenographer Grade-III'
    ],
    typingRequired: true,
    skillTestType: 'Computer Typing Test (English & Hindi)',
    overview:
      'Patna High Court conducts authentic bilingual typing tests for recruitment to Assistant and Typist cadres. Candidates must type the displayed passage with high accuracy and speed within strict 10-minute intervals.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 40,
    durationMinutes: 10,
    accuracyRequirement: 'Minimum 90% accuracy (95% for UR category)',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Evaluation as per Patna HC guidelines with deduction for spelling and punctuation errors',
    passageType: 'Legal judgments, socio-economic issues, administrative notifications',
    freeOrPro: 'free',
    officialSource: 'https://patnahighcourt.gov.in',
    notificationDate: '2024-04-10',
    lastVerified: '2025-02-15',
    status: 'Active',
    patternSummary: [
      'English Typing: 40 WPM for 10 minutes (approx. 400-420 words)',
      'Hindi Typing: 30 WPM for 10 minutes on Remington GAIL / InScript',
      'Two-box split display layout (Reference text on top, typing box below)',
      'Candidate must maintain high accuracy to qualify for merit list'
    ],
    instructions: [
      'Kindly type the highlighted word to proceed further.',
      'Kindly note, you can edit the text contents that you have typed.',
      'Correct/Wrong words turn Green/Red respectively.',
      'Kindly note, it is mandatory for you to type the entire text contents to submit.',
      'Upon timeout, the system will automatically submit your response.'
    ],
    faqs: [
      {
        question: 'What is the qualifying speed for Patna High Court English typing?',
        answer: 'Candidates must achieve a minimum of 40 Net WPM with at least 90% accuracy.'
      },
      {
        question: 'Which keyboard layout is supported for Hindi typing in Patna HC?',
        answer: 'Remington GAIL and InScript layouts using Mangal Unicode font are standard.'
      }
    ],
    relatedExams: ['high-court', 'bssc-bihar', 'supreme-court-jca']
  },

  'supreme-court-jca': {
    id: 'supreme-court-jca',
    name: 'Supreme Court JCA',
    fullName: 'Supreme Court of India Junior Court Assistant (JCA) Typing Test',
    shortTag: 'SCI JCA',
    slug: 'supreme-court-jca',
    conductedBy: 'Supreme Court of India Recruitment Cell',
    category: 'courts',
    state: 'New Delhi',
    posts: [
      'Junior Court Assistant (JCA)'
    ],
    typingRequired: true,
    skillTestType: 'Computer Typing Test (English Only)',
    overview:
      'The Supreme Court of India conducts one of the country’s most prestigious typing skill tests for Junior Court Assistants. Held in English on computer terminals with a strict 3% error ceiling.',
    qualifyingEnglishWpm: 35,
    durationMinutes: 10,
    accuracyRequirement: '35 WPM with not more than 3% permissible mistakes on computer',
    allowedErrorPercent: 3,
    supportedKeyboards: ['standard'],
    scoringMethod: 'Strict error check: errors exceeding 3% of master text result in immediate disqualification',
    passageType: 'Supreme Court Landmark Rulings, Appellate Judgments, Constitutional Benches',
    freeOrPro: 'pro',
    officialSource: 'https://main.sci.gov.in',
    notificationDate: '2022-06-18',
    lastVerified: '2024-12-20',
    status: 'Active',
    patternSummary: [
      'Language: English Only',
      'Target Speed: 35 Words Per Minute',
      'Permissible Mistakes: Maximum 3% allowed',
      'Duration: 10 Minutes'
    ],
    instructions: [
      'Accuracy is paramount: mistakes exceeding 3% mean disqualification regardless of speed.',
      'Transcribe case citations, paragraph numbers, and legal nomenclature meticulously.'
    ],
    faqs: [
      {
        question: 'Is Hindi typing tested in Supreme Court JCA?',
        answer: 'No. The Supreme Court JCA typing test is strictly conducted in English.'
      },
      {
        question: 'What is the maximum allowed mistake percentage in SCI JCA?',
        answer: 'Not more than 3% mistakes are permitted as per the official recruitment gazette.'
      }
    ],
    relatedExams: ['high-court', 'ssc-cgl-dest']
  },

  upsssc: {
    id: 'upsssc',
    name: 'UPSSSC Junior Assistant',
    fullName: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) Junior Assistant & Typist',
    shortTag: 'UPSSSC JA',
    slug: 'upsssc-junior-assistant',
    conductedBy: 'UPSSSC, Government of Uttar Pradesh',
    category: 'state_gov',
    state: 'Uttar Pradesh',
    posts: [
      'Junior Assistant (कनिष्ठ सहायक)',
      'Junior Clerk',
      'Assistant Grade-3',
      'Data Entry Operator in UP Government Departments'
    ],
    typingRequired: true,
    skillTestType: 'Bilingual Typing Skill Test (Hindi & English both mandatory)',
    overview:
      'UPSSSC conducts bilingual typing tests where candidates MUST qualify BOTH English (30 WPM) and Hindi (25 WPM) sections. Tests are conducted for 5 minutes each on computer terminals.',
    qualifyingHindiWpm: 25,
    qualifyingEnglishWpm: 30,
    durationMinutes: 5,
    accuracyRequirement: 'Minimum 85% Accuracy on both English and Hindi sections',
    allowedErrorPercent: 15,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript', 'krutidev'],
    scoringMethod: 'Net WPM calculated across 5-minute session for each language independently',
    passageType: 'UP State Administration, Rural Development, Public Health, Infrastructure',
    freeOrPro: 'free',
    officialSource: 'https://upsssc.gov.in',
    notificationDate: '2023-08-04',
    lastVerified: '2025-01-11',
    status: 'Active',
    patternSummary: [
      'Both Hindi and English typing are mandatory to qualify the exam',
      'Hindi Typing: 25 WPM for 5 Minutes duration (Mangal InScript / Remington GAIL / KrutiDev)',
      'English Typing: 30 WPM for 5 Minutes duration',
      'Qualifying in nature; mandatory for final recommendation'
    ],
    instructions: [
      'Do not neglect either language; failure in either Hindi or English results in overall rejection.',
      'Practice 5-minute sprints to build intense early speed.'
    ],
    faqs: [
      {
        question: 'Are both Hindi and English typing mandatory in UPSSSC Junior Assistant?',
        answer: 'Yes. Qualifying both Hindi (25 WPM) and English (30 WPM) typing tests is strictly compulsory.'
      },
      {
        question: 'Which Hindi layout is supported in UPSSSC typing?',
        answer: 'Candidates can select Mangal InScript, Remington GAIL, or KrutiDev 010 during the skill test slotting.'
      }
    ],
    relatedExams: ['cpct', 'high-court', 'bssc-bihar']
  },

  'bssc-bihar': {
    id: 'bssc-bihar',
    name: 'Bihar BSSC Clerk',
    fullName: 'Bihar Staff Selection Commission (BSSC) Inter Level Typist / Clerk Examination',
    shortTag: 'BSSC Typist',
    slug: 'bssc-bihar-clerk',
    conductedBy: 'Bihar Staff Selection Commission (BSSC)',
    category: 'state_gov',
    state: 'Bihar',
    posts: [
      'Revenue Employee Clerk',
      'Panchayat Secretary (Computer Typing Cadre)',
      'Clerk-cum-Typist',
      'Steno-Typist in Bihar Secretariat & Collectorates'
    ],
    typingRequired: true,
    skillTestType: 'Typing & Computer Proficiency Test',
    overview:
      'BSSC conducts typing examinations for 2nd Inter Level and Graduate Level clerical vacancies across Bihar government secretariats and district collectorates.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 35,
    durationMinutes: 10,
    accuracyRequirement: 'Maximum 1.5% to 2% error limit as per recent commission guidelines',
    allowedErrorPercent: 2,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Strict error deduction with 1.5% permissible errors threshold',
    passageType: 'Bihar Governance, Land Reforms, Panchayati Raj, Historical Heritage',
    freeOrPro: 'pro',
    officialSource: 'https://bssc.bihar.gov.in',
    notificationDate: '2023-09-19',
    lastVerified: '2025-01-07',
    status: 'Active',
    patternSummary: [
      'Hindi Typing: 30 WPM for 10 Minutes (Mangal Remington GAIL)',
      'English Typing: 35 WPM for 10 Minutes',
      'Strict error limit: max 1.5% permissible mistakes'
    ],
    instructions: [
      'Pay close attention to halant and complex conjuncts in Hindi typing.',
      'Avoid continuous backspacing as time is critical in 10-minute sessions.'
    ],
    faqs: [
      {
        question: 'What is the required Hindi speed for BSSC Clerk Typist?',
        answer: '30 Words Per Minute in Hindi on Mangal Remington GAIL layout.'
      }
    ],
    relatedExams: ['upsssc', 'cpct']
  },

  dsssb: {
    id: 'dsssb',
    name: 'DSSSB Junior Assistant / LDC',
    fullName: 'Delhi Subordinate Services Selection Board (DSSSB) LDC, Junior Assistant & Steno',
    shortTag: 'DSSSB JA',
    slug: 'dsssb-junior-assistant',
    conductedBy: 'DSSSB, Government of NCT of Delhi',
    category: 'delhi',
    state: 'Delhi',
    posts: [
      'Grade-IV Junior Assistant',
      'Lower Division Clerk (LDC)',
      'Assistant Grade-I (Delhi State Civil Supplies & DSIIDC)',
      'Stenographer Grade-III'
    ],
    typingRequired: true,
    skillTestType: 'Computer Typing Skill Test',
    overview:
      'DSSSB conducts skill tests for clerical and ministerial appointments across Delhi Government departments, MCD, NDMC, and autonomous Delhi corporations.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 35,
    durationMinutes: 10,
    accuracyRequirement: 'Maximum 5% errors permissible for UR; 7% for Reserved categories',
    allowedErrorPercent: 5,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Net WPM calculation with mistake percentage cutoff',
    passageType: 'Municipal Administration, Urban Governance, Education & Healthcare in Delhi',
    freeOrPro: 'free',
    officialSource: 'https://dsssb.delhi.gov.in',
    notificationDate: '2024-01-09',
    lastVerified: '2025-01-12',
    status: 'Active',
    patternSummary: [
      'English: 35 WPM on computer (10,500 KDPH)',
      'Hindi: 30 WPM on computer (9,000 KDPH on Mangal font)',
      'Duration: 10 Minutes',
      'Candidate selects either English or Hindi medium'
    ],
    instructions: [
      'Position accuracy first; DSSSB rejects candidates exceeding the 5% error ceiling regardless of gross speed.',
      'Check screen calibration and keyboard response before the mock countdown ends.'
    ],
    faqs: [
      {
        question: 'Can I choose between English and Hindi in DSSSB?',
        answer: 'Yes, DSSSB allows candidates to opt for either English (35 WPM) or Hindi (30 WPM) typing.'
      }
    ],
    relatedExams: ['ssc-chsl', 'delhi-police-hcm']
  },

  'state-gov': {
    id: 'state-gov',
    name: 'State Secretariat & Ministerial',
    fullName: 'State Government Secretariats, Revenue Boards & Clerical Cadres',
    shortTag: 'State Gov',
    slug: 'state-secretariat-clerk',
    conductedBy: 'Various State Public Service Commissions & Subordinate Boards',
    category: 'state_gov',
    state: 'Various States (MP, Rajasthan, Maharashtra, Haryana)',
    posts: [
      'Secretariat Assistant',
      'LDC / Clerk-cum-Typist',
      'Revenue Patwari & Typist',
      'Judicial Record Keeper'
    ],
    typingRequired: true,
    skillTestType: 'Computer Proficiency & Typing Test',
    overview:
      'Comprehensive benchmark testing for state ministerial posts requiring standard typing speeds in regional and national administrative contexts.',
    qualifyingHindiWpm: 25,
    qualifyingEnglishWpm: 30,
    durationMinutes: 10,
    accuracyRequirement: '80% to 90% Net Accuracy based on respective state service rules',
    allowedErrorPercent: 8,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Standard Net WPM formula: (Gross Characters / 5 - Errors) / Duration',
    passageType: 'State Budgeting, Public Welfare Policies, e-Governance, Regional Development',
    freeOrPro: 'free',
    officialSource: 'State Government Gazette Notifications',
    notificationDate: '2024-01-01',
    lastVerified: '2025-01-10',
    status: 'Active',
    patternSummary: [
      'English: 30 WPM / Hindi: 25 WPM standard benchmark',
      'Test Duration: 10 Minutes',
      'Flexible options for Remington GAIL and InScript layout'
    ],
    instructions: [
      'Consistent daily practice ensures muscle memory across long passages.',
      'Maintain upright posture and minimize looking down at physical keys.'
    ],
    faqs: [
      {
        question: 'What is the average state government typing requirement?',
        answer: 'Most state commissions prescribe 30 WPM for English typing and 25 WPM for Hindi typing in 10-minute sessions.'
      }
    ],
    relatedExams: ['cpct', 'upsssc', 'ssc-chsl']
  },

  'autonomous-inst': {
    id: 'autonomous-inst',
    name: 'AIIMS & Autonomous Institutes JAA',
    fullName: 'AIIMS, IITs, NITs & Central Universities Junior Administrative Assistant (JAA)',
    shortTag: 'Autonomous JAA',
    slug: 'autonomous-institutes-clerk',
    conductedBy: 'National Testing Agency (NTA) & Autonomous Recruitment Cells',
    category: 'autonomous',
    state: 'All India',
    posts: [
      'Junior Administrative Assistant (JAA)',
      'Lower Division Clerk (LDC)',
      'Data Entry Operator Grade-A',
      'Office Attendant & Clerk'
    ],
    typingRequired: true,
    skillTestType: 'Computer Typing Test (NTA / Institute Pattern)',
    overview:
      'NTA and individual premier institutes (AIIMS, IITs, NITs, Central Universities) conduct typing skill tests for ministerial staff handling student records, hospital admissions, and academic administration.',
    qualifyingHindiWpm: 30,
    qualifyingEnglishWpm: 35,
    keyDepressionsTarget: 1750,
    durationMinutes: 10,
    accuracyRequirement: 'Standard 7% error limit for General category; qualifying in nature',
    allowedErrorPercent: 7,
    supportedKeyboards: ['standard', 'remington_gail', 'inscript'],
    scoringMethod: 'Mistake Percentage against target passage length',
    passageType: 'Academic Research, Medical Technology, Higher Education Policy',
    freeOrPro: 'pro',
    officialSource: 'https://creaiims.aiimsexams.ac.in / https://nta.ac.in',
    notificationDate: '2024-05-15',
    lastVerified: '2025-01-10',
    status: 'Active',
    patternSummary: [
      'English: 35 WPM / Hindi: 30 WPM on computer',
      'Duration: 10 Minutes continuous session',
      'Conducted under NTA or institutional recruitment software'
    ],
    instructions: [
      'Focus on scientific terminology and academic documentation syntax.',
      'Exercise caution with capitalized acronyms (AIIMS, ICMR, CSIR, UGC).'
    ],
    faqs: [
      {
        question: 'Who conducts typing tests for AIIMS Junior Administrative Assistant?',
        answer: 'Typically conducted by AIIMS Examination Section or National Testing Agency (NTA) on standard computer testing platforms.'
      }
    ],
    relatedExams: ['ssc-chsl', 'dsssb']
  }
};
