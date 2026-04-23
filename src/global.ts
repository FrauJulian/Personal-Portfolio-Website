export interface PortfolioProject {
  title: string;
  link: string;
  description: string;
  languages: string[];
  icon?: string;
  CircleIcon?: boolean;
}

export interface PortraitHighlight {
  image: string;
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
      image: 'assets/portrait/me.png',
      text: 'ME',
    },
    {
      image: 'assets/portrait/love.jpg',
      text: 'My Love',
    },
    {
      image: 'assets/portrait/sbua.jpg',
      text: 'Scuba Diving',
    },
    {
      image: 'assets/portrait/trains.jpg',
      text: 'Trains',
    },
    {
      image: 'assets/portrait/traveling.jpg',
      text: 'Traveling',
    },
    {
      image: 'assets/portrait/culture.jpg',
      text: 'Culture',
    },
  ],
  projects: [
    {
      title: 'SobIT GmbH',
      link: 'https://sobit.at/',
      description: 'I currently work primarily for the viennese company SobIT GmbH. This company develops software for the healthcare industry. - Development of modern desktop, mobile, and web applications to support healthcare delivery.',
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
      icon: 'https://gerlach-systems.de/IMAGES/SYNHOST/SYNHOST_DARK.png',
      CircleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A support system integrating various platforms and media to offer employees a unified overview.',
      languages: ['TypeScript'],
      icon: 'https://gerlach-systems.de/IMAGES/SYNHOST/SYNHOST_DARK.png',
      CircleIcon: false,
    },
    {
      title: 'SynHost',
      link: 'https://www.synhost.de/',
      description:
        'A support system integrating various platforms and media to offer employees a unified overview.',
      languages: ['TypeScript'],
      icon: 'https://gerlach-systems.de/IMAGES/SYNHOST/SYNHOST_DARK.png',
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
