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
  bioTextsList: string[];
  portraitHighlights: PortraitHighlight[];
  projects: PortfolioProject[];
  address: ImprintData;
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
    'C#',
    '.NET',
    '.NET Framework',
    'WPF',
    'Avalonia',
    'NodeJS',
    'Angular',
    'TypeScript',
    'JavaScript',
    'Java',
    'HTML',
    '(S)CSS',
    'Github',
    'Gitlab',
    'Azure DevOps',
    'Ubuntu',
    'Debian',
    'SSMS',
    'MariaDB',
    'MySQL',
    'Grandle',
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
      image: 'assets/portrait/anniversary.jpg',
      text: 'Anniversary',
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
      title: 'SynRadio',
      link: 'https://www.synradio.de/',
      description: 'An internet radio station that is available on various media.',
      languages: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
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
