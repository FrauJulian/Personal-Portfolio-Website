import type { LanguagePack } from './language.types';

export const enLanguage: LanguagePack = {
  home: {
    portfolioEyebrow: 'Portfolio',
    heroIntro:
      'I build reliable systems, clean interfaces, and practical digital solutions that actually hold up in production.',
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
      'My name is {{firstname}}, many people also call me Julie. I am {{age}} and based in Austria. A large part of my day happens on the move, usually on trains.',
      'I care deeply about digital security and privacy. I design systems with minimal exposure, sensible defaults, and a strong focus on data protection.',
      'I work with modern web technologies and on business-critical systems. I focus on clear, stable solutions that hold up in day-to-day use and deliver value.',
    ],
    detailToggleOpen: 'Read more',
    detailToggleClose: 'Read less',
    detailParagraphs: [
      'What really interests me is modern code: well-structured, maintainable, and built with performance in mind.',
      'Outside of software, my main hobby is scuba diving. The thought of complete stillness underwater keeps drawing me back into the depths of Austria’s lakes.',
      'I mainly work for SobIT GmbH in Vienna, alongside long term projects for companies, organizations, and private clients.',
    ],
    getInTouch: 'Get in touch!',
    projectsEyebrow: 'Current Jobs & Projects',
    openProjectPrefix: 'Open project',
    projectIconAltSuffix: 'logo',
    mailAriaLabel: 'Send an email',
    phoneAriaLabel: 'Call phone number',
    signalAriaLabel: 'Message on Signal',
    giteaAriaLabel: 'Gitea profile',
    linkedinAriaLabel: 'LinkedIn profile',
    skillsLabel: 'Skills',
    skillsLinkAriaLabel: 'View all skills on LinkedIn',
  },
  imprint: {
    legalEyebrow: 'Legal',
    title: 'Imprint & Privacy',
    intro:
      'Legal information under Austrian law and privacy information under the GDPR for all websites operated by {{firstname}} {{lastname}}.',
    backToPortfolio: 'Back to portfolio',
    provider: 'Provider',
    directContact: 'Direct Contact',
    phone: 'Phone',
    contact: 'Email',
    abuse: 'Abuse Email',
    privacyEyebrow: 'Privacy',
    privacyTitle: 'No Data Collection',
    privacyLeft:
      'This website does not collect or process personal data. The only exception is information that is technically transmitted when a website is accessed, such as IP address, date and time, requested page, referrer, and browser and operating system information (user agent).',
    privacyRight:
      'This data is used solely to operate the website securely and reliably (Art. 6(1)(f) GDPR). There is no tracking and there are no cookies. Your chosen language is stored only locally in your browser.',
    rightsEyebrow: 'Rights',
    rightsTitle: 'Your Rights Under The GDPR',
    rightsLeft:
      'You have the right of access, rectification, erasure, restriction of processing, data portability, and objection. Send requests to the email address listed above.',
    rightsRight:
      'Complaints can be filed with the Austrian Data Protection Authority, Barichgasse 40-42, 1030 Vienna, dsb@dsb.gv.at.',
    copyrightEyebrow: 'Copyright',
    copyrightTitle: 'Copyright & Liability',
    copyrightLeftParagraphs: [
      'All content on all websites operated by {{firstname}} {{lastname}}, in particular texts, images, photographs, graphics, and design, is protected by copyright. All rights reserved.',
      'Any reproduction, modification, distribution, or other use without my prior written consent is prohibited. The source code is governed solely by the license stated in its repository.',
    ],
    copyrightRightParagraphs: [
      'I accept no liability for the content of linked external websites. Their operators are solely responsible for it.',
      'Austrian law applies, unless mandatory consumer protection provisions provide otherwise.',
    ],
  },
  bioTextsList: [
    'C#',
    'TypeScript',
    'JavaScript',
    'Java',
    'SQL',
    'Bash',
    'Windows PowerShell',
    '.NET Core',
    '.NET Framework',
    'ASP.NET',
    'Entity Framework (EF) Core',
    'Windows Presentation Foundation (WPF)',
    'Model View ViewModel (MVVM)',
    'Model View Controller (MVC)',
    'Web Development',
    'AngularJS',
    'Node.js',
    'Microsoft SQL Server',
    'MariaDB',
    'Git',
    'GitHub',
    'GitLab',
    'Azure DevOps',
    'Continuous Integration and Continuous Delivery (CI/CD)',
    'System Administration',
    'Linux Server',
    'Windows Server',
    'Proxmox',
    'Email Security & Authentication: SPF, DKIM, DMARC, DNSSEC/DANE & MTA-STS',
    'Artificial Intelligence (AI)',
    'AI Agents',
    'Anthropic Claude',
    'OpenAI Codex',
    'Agile',
    'Scrum',
    'Project Management',
    'Project Communication',
  ],
  portraitHighlights: [
    {
      image: 'assets/optimized/portrait/me.webp',
      imageSrcset:
        'assets/optimized/portrait/me-320.webp 320w, assets/optimized/portrait/me-384.webp 384w, assets/optimized/portrait/me-480.webp 480w, assets/optimized/portrait/me.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 4rem), (max-width: 900px) min(calc(100vw - 9rem), 560px), 320px',
      imageWidth: 640,
      imageHeight: 769,
      text: 'ME',
    },
    {
      image: 'assets/optimized/portrait/love.webp',
      imageSrcset:
        'assets/optimized/portrait/love-320.webp 320w, assets/optimized/portrait/love-384.webp 384w, assets/optimized/portrait/love-480.webp 480w, assets/optimized/portrait/love.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 4rem), (max-width: 900px) min(calc(100vw - 9rem), 560px), 320px',
      imageWidth: 640,
      imageHeight: 710,
      text: 'Love',
    },
    {
      image: 'assets/optimized/portrait/scuba.webp',
      imageSrcset:
        'assets/optimized/portrait/scuba-320.webp 320w, assets/optimized/portrait/scuba-384.webp 384w, assets/optimized/portrait/scuba-480.webp 480w, assets/optimized/portrait/scuba.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 4rem), (max-width: 900px) min(calc(100vw - 9rem), 560px), 320px',
      imageWidth: 640,
      imageHeight: 480,
      text: 'Scuba Diving',
    },
    {
      image: 'assets/optimized/portrait/trains.webp',
      imageSrcset:
        'assets/optimized/portrait/trains-320.webp 320w, assets/optimized/portrait/trains-384.webp 384w, assets/optimized/portrait/trains-480.webp 480w, assets/optimized/portrait/trains.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 4rem), (max-width: 900px) min(calc(100vw - 9rem), 560px), 320px',
      imageWidth: 640,
      imageHeight: 850,
      text: 'Trains',
    },
    {
      image: 'assets/optimized/portrait/traveling.webp',
      imageSrcset:
        'assets/optimized/portrait/traveling-320.webp 320w, assets/optimized/portrait/traveling-384.webp 384w, assets/optimized/portrait/traveling-480.webp 480w, assets/optimized/portrait/traveling.webp 640w',
      imageSizes:
        '(max-width: 700px) calc(100vw - 4rem), (max-width: 900px) min(calc(100vw - 9rem), 560px), 320px',
      imageWidth: 640,
      imageHeight: 480,
      text: 'Traveling',
    },
  ],
  projects: [
    {
      title: 'SobIT GmbH',
      link: 'https://sobit.at/',
      description:
        'I primarily work for SobIT GmbH, a Vienna-based subsidiary of Wiener Sozialdienste. We develop software for the healthcare sector, focusing on modern desktop, mobile, and web applications that support mobile care services.',
      icon: 'assets/optimized/logos/sobit.webp',
      iconSrcset:
        'assets/optimized/logos/sobit-64.webp 64w, assets/optimized/logos/sobit-128.webp 128w, assets/optimized/logos/sobit.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      circleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A hosting service provider of GERLACH SYSTEMS, for whom I develop interfaces between individual systems and provide technical support.',
      icon: 'assets/optimized/logos/synhost.webp',
      iconSrcset:
        'assets/optimized/logos/synhost-64.webp 64w, assets/optimized/logos/synhost-128.webp 128w, assets/optimized/logos/synhost.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      iconWidth: 108,
      iconHeight: 64,
      circleIcon: false,
    },
    {
      title: 'SynRadio',
      link: 'https://www.synradio.de/',
      description:
        'An online radio project, also operated by GERLACH SYSTEMS, where I build and maintain the technical side of its digital presence — including the website, bots, and plugins for voice chats and games.',
      icon: 'assets/optimized/logos/synradio.webp',
      iconSrcset:
        'assets/optimized/logos/synradio-64.webp 64w, assets/optimized/logos/synradio-128.webp 128w, assets/optimized/logos/synradio.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      circleIcon: true,
    },
    {
      title: 'Discord Audio Stream Library',
      link: 'https://git.lechner-systems.at/fraujulian/Discord-Audio-Stream',
      description:
        'A TypeScript library for Discord that simplifies audio playback, with a focus on stable 24/7 streaming without interruptions.',
      icon: 'assets/optimized/logos/discord.webp',
      iconSrcset:
        'assets/optimized/logos/discord-64.webp 64w, assets/optimized/logos/discord-128.webp 128w, assets/optimized/logos/discord.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      circleIcon: true,
    },
    {
      title: 'Portfolio',
      link: '',
      description:
        'This portfolio website you’re currently viewing is one of my actively maintained projects. 😁',
      icon: 'assets/optimized/portrait/me.webp',
      iconSrcset:
        'assets/optimized/portrait/me-128.webp 128w, assets/optimized/portrait/me-320.webp 320w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      iconWidth: 320,
      iconHeight: 385,
      circleIcon: true,
    },
    {
      title: 'Tauchertreff-Mostviertel',
      link: 'https://tauchertreff-mostviertel.at/',
      description:
        'I also support my local diving club by developing, setting up, and operating its digital infrastructure — including email, the website, cloud services, and everything that comes with it.',
      icon: 'assets/optimized/logos/tauchertreff.webp',
      iconSrcset:
        'assets/optimized/logos/tauchertreff-64.webp 64w, assets/optimized/logos/tauchertreff-128.webp 128w, assets/optimized/logos/tauchertreff.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      circleIcon: true,
    },
  ],
};
