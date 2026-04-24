export interface PortfolioProject {
  title: string;
  link: string;
  description: string;
  languages: string[];
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
  CircleIcon?: boolean;
}

export interface PortraitHighlight {
  image: string;
  avifSrcset: string;
  webpSrcset: string;
  width: number;
  height: number;
  alt: string;
  text: string;
}

export interface ImprintData {
  street: string;
  houseNumber: number;
  zip: number;
  city: string;
  country: string;
}

export interface Global {
  firstname: string;
  lastname: string;
  contactMail: string;
  abuseMail: string;
  contactPhone: string;
  hrefContactPhone: string;
  birthdate: string;
  bioTextsList: BioTextEntry[];
  portraitHighlights: PortraitHighlight[];
  projects: PortfolioProject[];
  address: ImprintData;
}

export interface BioTextEntry {
  label: string;
  value: string;
}

export const global: Global = {
  firstname: 'Julian',
  lastname: 'Lechner',
  contactMail: 'fraujulian@lechner.top',
  abuseMail: 'abuse@lechner-systems.at',
  contactPhone: '+43 (0) 660 9254001',
  hrefContactPhone: '+436609254001',
  birthdate: '2009-03-03',
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
      image: 'assets/optimized/portrait/me-960.jpg',
      avifSrcset:
        'assets/optimized/portrait/me-480.avif 480w, assets/optimized/portrait/me-720.avif 720w, assets/optimized/portrait/me-960.avif 900w',
      webpSrcset:
        'assets/optimized/portrait/me-480.webp 480w, assets/optimized/portrait/me-720.webp 720w, assets/optimized/portrait/me-960.webp 900w',
      width: 900,
      height: 1154,
      alt: 'Portrait of Julian Lechner',
      text: 'ME',
    },
    {
      image: 'assets/optimized/portrait/love-960.jpg',
      avifSrcset:
        'assets/optimized/portrait/love-480.avif 480w, assets/optimized/portrait/love-720.avif 720w, assets/optimized/portrait/love-960.avif 960w',
      webpSrcset:
        'assets/optimized/portrait/love-480.webp 480w, assets/optimized/portrait/love-720.webp 720w, assets/optimized/portrait/love-960.webp 960w',
      width: 960,
      height: 1065,
      alt: 'Julian with his partner',
      text: 'My Love',
    },
    {
      image: 'assets/optimized/portrait/scuba-960.jpg',
      avifSrcset:
        'assets/optimized/portrait/scuba-480.avif 480w, assets/optimized/portrait/scuba-720.avif 720w, assets/optimized/portrait/scuba-960.avif 960w',
      webpSrcset:
        'assets/optimized/portrait/scuba-480.webp 480w, assets/optimized/portrait/scuba-720.webp 720w, assets/optimized/portrait/scuba-960.webp 960w',
      width: 960,
      height: 720,
      alt: 'Julian scuba diving',
      text: 'Scuba Diving',
    },
    {
      image: 'assets/optimized/portrait/trains-960.jpg',
      avifSrcset:
        'assets/optimized/portrait/trains-480.avif 480w, assets/optimized/portrait/trains-720.avif 720w, assets/optimized/portrait/trains-960.avif 960w',
      webpSrcset:
        'assets/optimized/portrait/trains-480.webp 480w, assets/optimized/portrait/trains-720.webp 720w, assets/optimized/portrait/trains-960.webp 960w',
      width: 960,
      height: 1275,
      alt: 'Julian traveling by train',
      text: 'Trains',
    },
    {
      image: 'assets/optimized/portrait/traveling-960.jpg',
      avifSrcset:
        'assets/optimized/portrait/traveling-480.avif 480w, assets/optimized/portrait/traveling-720.avif 720w, assets/optimized/portrait/traveling-960.avif 960w',
      webpSrcset:
        'assets/optimized/portrait/traveling-480.webp 480w, assets/optimized/portrait/traveling-720.webp 720w, assets/optimized/portrait/traveling-960.webp 960w',
      width: 960,
      height: 720,
      alt: 'Julian traveling',
      text: 'Traveling',
    },
    {
      image: 'assets/optimized/portrait/culture-960.jpg',
      avifSrcset:
        'assets/optimized/portrait/culture-480.avif 480w, assets/optimized/portrait/culture-720.avif 720w, assets/optimized/portrait/culture-960.avif 960w',
      webpSrcset:
        'assets/optimized/portrait/culture-480.webp 480w, assets/optimized/portrait/culture-720.webp 720w, assets/optimized/portrait/culture-960.webp 960w',
      width: 960,
      height: 723,
      alt: 'Julian visiting cultural landmarks',
      text: 'Culture',
    },
  ],
  projects: [
    {
      title: 'SobIT GmbH',
      link: 'https://sobit.at/',
      description:
        'I currently work primarily for the viennese company SobIT GmbH. This company develops software for the healthcare industry. - Development of modern desktop, mobile, and web applications to support healthcare delivery.',
      languages: ['TypeScript', 'C#', 'WPF', 'YML', 'XAML'],
      icon: 'assets/logos/sobit.png',
      CircleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A support system integrating various platforms and media to offer employees a unified overview.',
      languages: ['TypeScript'],
      icon: 'assets/logos/synhost-dark.webp',
      iconWidth: 230,
      iconHeight: 136,
      CircleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A support system integrating various platforms and media to offer employees a unified overview.',
      languages: ['TypeScript'],
      icon: 'assets/logos/synhost-dark.webp',
      iconWidth: 230,
      iconHeight: 136,
      CircleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A support system integrating various platforms and media to offer employees a unified overview.',
      languages: ['TypeScript'],
      icon: 'assets/logos/synhost-dark.webp',
      iconWidth: 230,
      iconHeight: 136,
      CircleIcon: false,
    },
  ],
  address: {
    street: 'Ulmenstraße',
    houseNumber: 9,
    zip: 3380,
    city: 'Pöchlarn',
    country: 'Austria',
  },
};
