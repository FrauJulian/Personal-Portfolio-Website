import type { LanguagePack } from './language.types';

export const enLanguage: LanguagePack = {
  app: {
    selectorTitle: 'Select language',
    changeLanguage: 'Language',
    changeLanguageAriaLabel: 'Change language',
    closeSelector: 'Close language selection',
    languageEnglish: 'English',
    languageGerman: 'German',
  },
  footer: {
    noscriptMessage: 'Please enable JavaScript for the full experience.',
    imprintLink: 'Imprint',
  },
  home: {
    portfolioEyebrow: 'Portfolio',
    heroIntro:
      'Building reliable systems, clean interfaces, and practical digital solutions that actually hold up in production.',
    contactTitle: 'Contact me',
    viewProjects: 'View projects',
    aboutMe: 'About me',
    nextHighlightAriaLabel: 'Show next image',
    nextHighlightTitle: 'Show next image',
    singleHighlightTitle: 'Single image',
    portraitAltSuffix: 'Image',
    clickHint: 'Click me!',
    aboutEyebrow: 'About me',
    aboutParagraphs: [
      'My name is {{firstname}}, many people also call me Julie. I am {{age}} and based in Austria. A large part of my day happens on the move, usually on trains, going between meetings, offices, and my family.',
      'I care deeply about digital security and privacy. I design systems with minimal exposure, sensible defaults, and a strong focus on data protection.',
      'I work with modern web technologies and on business-critical systems. I focus on clear, stable solutions that hold up in day-to-day use and deliver value.',
    ],
    detailToggleOpen: 'Read more',
    detailToggleClose: 'Read less',
    detailParagraphs: [
      'What really interests me is modern code: well-structured, maintainable, and built with performance in mind.',
      "Outside of software, my main hobby is scuba diving. The silence underwater keeps pulling me back into Austria's lakes.",
      'I mainly work for SobIT GmbH in Vienna, alongside freelance projects for companies, organizations, and private clients.',
    ],
    getInTouch: 'Get in touch',
    projectsEyebrow: 'Current Jobs & Projects',
    openProjectPrefix: 'Open project',
    projectLanguagesAriaLabel: 'Project languages',
    fallbackBioLabel: 'my stack',
  },
  imprint: {
    legalEyebrow: 'Legal',
    title: 'Imprint & Privacy',
    intro:
      'Legal information for this website under Austrian law, including privacy information for websites operated by {{firstname}} {{lastname}} (Lechner Systems).',
    backToPortfolio: 'Back to portfolio',
    provider: 'Provider',
    directContact: 'Direct Contact',
    phone: 'Phone',
    contact: 'Contact',
    abuse: 'Abuse',
    scopeEyebrow: 'Scope',
    scopeTitle: 'Scope Of These Notices',
    scopeLeft:
      'These notices apply to this website and, unless a more specific notice is published there, to other websites operated by Julian Lechner under the name Lechner Systems.',
    scopeRight:
      'This website provides information about projects, technical services, contact options, and professional work in software engineering, IT, and related digital services.',
    privacyEyebrow: 'Privacy',
    privacyTitle: 'Privacy And Data Processing',
    privacyLeftParagraphs: [
      'The controller for data processing within the meaning of the GDPR is {{firstname}} {{lastname}}, reachable at {{contactMail}} and by phone at {{contactPhone}}.',
      'As currently implemented in this web project, this website does not use its own tracking, analytics cookies, marketing cookies, or long-term personal usage profiling.',
      'For informational website access, technically necessary connection and server data may be processed for operation, IT security, abuse prevention, and troubleshooting.',
    ],
    privacyRightParagraphs: [
      'If you contact me by email or phone, the data you provide is processed to handle your request and maintain communication.',
      'Personal data is disclosed only where legally required, needed for legal claims, or explicitly initiated by you.',
      'Data is stored only as long as required for communication, request handling, and legal retention duties.',
    ],
    rightsEyebrow: 'Rights',
    rightsTitle: 'Data Subject Rights And Complaints',
    rightsLeft:
      'Subject to statutory requirements, data subjects have the right of access, rectification, erasure, restriction of processing, data portability, and objection.',
    rightsRight:
      'Complaints can be submitted to the Austrian Data Protection Authority: Barichgasse 40-42, 1030 Vienna, email dsb@dsb.gv.at, website dsb.gv.at.',
    copyrightEyebrow: 'Copyright',
    copyrightTitle: 'Copyright, External Links, And Applicable Law',
    copyrightLeftParagraphs: [
      'All content on this website, including texts, images, graphics, photographs, layouts, source code, and other works, is protected by copyright unless stated otherwise.',
      'Any use beyond statutory exceptions requires prior written consent of the respective rights holder.',
    ],
    copyrightRightParagraphs: [
      'This website may contain links to third-party websites. Their operators are solely responsible for those contents.',
      'Austrian law applies exclusively, unless mandatory consumer protection provisions require otherwise.',
    ],
  },
  bioTextsList: [
    { label: 'Languages', value: 'C#' },
    { label: 'Languages', value: 'TypeScript' },
    { label: 'Languages', value: 'Bash' },
    { label: 'Frontend', value: 'Angular' },
    { label: 'Frontend', value: 'WPF' },
    { label: 'Frontend', value: 'Avalonia' },
    { label: 'Backend', value: '.NET' },
    { label: 'Backend', value: 'ASP.NET Core' },
    { label: 'Backend', value: 'Entity Framework Core' },
    { label: 'Backend', value: 'Node.js' },
    { label: 'Backend', value: 'REST' },
    { label: 'Backend', value: 'Swagger' },
    { label: 'Database', value: 'Microsoft SQL' },
    { label: 'Database', value: 'MariaDB' },
    { label: 'DevOps', value: 'Git' },
    { label: 'DevOps', value: 'GitHub & GitLab' },
    { label: 'DevOps', value: 'Azure DevOps' },
    { label: 'DevOps', value: 'Docker' },
    { label: 'DevOps', value: 'Ubuntu' },
    { label: 'DevOps', value: 'Arch' },
    { label: 'Declarative Languages', value: 'XAML' },
    { label: 'Declarative Languages', value: 'YAML' },
    { label: 'Declarative Languages', value: 'Markdown' },
  ],
  portraitHighlights: [
    {
      image: 'assets/optimized/portrait/me.webp',
      imageSrcset:
        'assets/optimized/portrait/me-320.webp 320w, assets/optimized/portrait/me-480.webp 480w, assets/optimized/portrait/me.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 2rem), (max-width: 900px) min(100vw - 6rem, 560px), 560px',
      imageWidth: 640,
      imageHeight: 769,
      text: 'ME',
    },
    {
      image: 'assets/optimized/portrait/love.webp',
      imageSrcset:
        'assets/optimized/portrait/love-320.webp 320w, assets/optimized/portrait/love-480.webp 480w, assets/optimized/portrait/love.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 2rem), (max-width: 900px) min(100vw - 6rem, 560px), 560px',
      imageWidth: 640,
      imageHeight: 710,
      text: 'My Love',
    },
    {
      image: 'assets/optimized/portrait/scuba.webp',
      imageSrcset:
        'assets/optimized/portrait/scuba-320.webp 320w, assets/optimized/portrait/scuba-480.webp 480w, assets/optimized/portrait/scuba.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 2rem), (max-width: 900px) min(100vw - 6rem, 560px), 560px',
      imageWidth: 640,
      imageHeight: 480,
      text: 'Scuba Diving',
    },
    {
      image: 'assets/optimized/portrait/trains.webp',
      imageSrcset:
        'assets/optimized/portrait/trains-320.webp 320w, assets/optimized/portrait/trains-480.webp 480w, assets/optimized/portrait/trains.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 2rem), (max-width: 900px) min(100vw - 6rem, 560px), 560px',
      imageWidth: 640,
      imageHeight: 850,
      text: 'Trains',
    },
    {
      image: 'assets/optimized/portrait/traveling.webp',
      imageSrcset:
        'assets/optimized/portrait/traveling-320.webp 320w, assets/optimized/portrait/traveling-480.webp 480w, assets/optimized/portrait/traveling.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 2rem), (max-width: 900px) min(100vw - 6rem, 560px), 560px',
      imageWidth: 640,
      imageHeight: 480,
      text: 'Traveling',
    },
    {
      image: 'assets/optimized/portrait/culture.webp',
      imageSrcset:
        'assets/optimized/portrait/culture-320.webp 320w, assets/optimized/portrait/culture-480.webp 480w, assets/optimized/portrait/culture.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 2rem), (max-width: 900px) min(100vw - 6rem, 560px), 560px',
      imageWidth: 640,
      imageHeight: 482,
      text: 'Culture',
    },
  ],
  projects: [
    {
      title: 'SobIT GmbH',
      link: 'https://sobit.at/',
      description:
        'I currently work primarily for the viennese company SobIT GmbH. This company develops software for the healthcare industry. - Development of modern desktop, mobile, and web applications to support healthcare delivery.',
      skills: ['TypeScript', 'C#', 'Microsoft SQL', 'WPF', 'YML/XML'],
      icon: 'assets/optimized/logos/sobit.webp',
      iconSrcset:
        'assets/optimized/logos/sobit-64.webp 64w, assets/optimized/logos/sobit-128.webp 128w, assets/optimized/logos/sobit.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A hosting provider operated by GERLACH SYSTEMS, where I develop integrations and handle technical support.',
      skills: ['TypeScript', 'MariaDB', 'YML'],
      icon: 'assets/optimized/logos/synhost.webp',
      iconSrcset:
        'assets/optimized/logos/synhost-64.webp 64w, assets/optimized/logos/synhost-128.webp 128w, assets/optimized/logos/synhost.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      iconWidth: 108,
      iconHeight: 64,
      CircleIcon: false,
    },
    {
      title: 'SynRadio',
      link: 'https://www.synradio.de/',
      description:
        'An online radio project, also operated by GERLACH SYSTEMS, where I build and maintain the technical side of its digital presence — including the website, bots, and plugins for voice chats and games.',
      skills: ['TypeScript', 'Angular', 'FFmpeg', 'YML'],
      icon: 'assets/optimized/logos/synradio.webp',
      iconSrcset:
        'assets/optimized/logos/synradio-64.webp 64w, assets/optimized/logos/synradio-128.webp 128w, assets/optimized/logos/synradio.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: true,
    },
    {
      title: 'Discord Audio Stream Library',
      link: 'https://github.com/FrauJulian/Discord-Audio-Stream',
      description:
        'A TypeScript library for Discord that simplifies audio playback, with a focus on stable 24/7 streaming without interruptions.',
      skills: ['TypeScript', 'YML'],
      icon: 'assets/optimized/logos/discord.webp',
      iconSrcset:
        'assets/optimized/logos/discord-64.webp 64w, assets/optimized/logos/discord-128.webp 128w, assets/optimized/logos/discord.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: true,
    },
    {
      title: 'Portfolio',
      link: '#',
      description:
        'This portfolio website you’re currently viewing is one of my actively maintained projects.',
      skills: ['TypeScript', 'Angular', 'YML'],
      icon: 'assets/optimized/portrait/me.webp',
      iconSrcset:
        'assets/optimized/portrait/me-64.webp 64w, assets/optimized/portrait/me-128.webp 128w, assets/optimized/portrait/me.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      iconWidth: 320,
      iconHeight: 385,
      CircleIcon: true,
    },
    {
      title: 'Tauchertreff-Mostviertel',
      link: 'https://tauchertreff-mostviertel.at/',
      description:
        'I also support my local diving club by building and running its digital infrastructure — email, website, cloud services, and everything around it.',
      skills: ['TypeScript', 'MariaDB', 'Angular', 'YML'],
      icon: 'assets/optimized/logos/tauchertreff.webp',
      iconSrcset:
        'assets/optimized/logos/tauchertreff-64.webp 64w, assets/optimized/logos/tauchertreff-128.webp 128w, assets/optimized/logos/tauchertreff.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: true,
    },
  ],
};
