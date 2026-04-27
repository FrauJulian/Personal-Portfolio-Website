export interface PortfolioProject {
  title: string;
  link: string;
  description: string;
  skills: string[];
  icon?: string;
  iconSrcset?: string;
  iconSizes?: string;
  CircleIcon?: boolean;
}

export interface PortraitHighlight {
  image: string;
  imageSrcset: string;
  imageSizes: string;
  imageWidth: number;
  imageHeight: number;
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
      skills: ['TypeScript', 'C#', 'WPF', 'YML', 'XAML'],
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
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ',
      skills: ['TypeScript'],
      icon: 'assets/optimized/logos/synhost.webp',
      iconSrcset:
        'assets/optimized/logos/synhost-64.webp 64w, assets/optimized/logos/synhost-128.webp 128w, assets/optimized/logos/synhost.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: false,
    },
    {
      title: 'SynRadio',
      link: 'https://www.synradio.de/',
      description:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ',
      skills: ['TypeScript', 'Angular', 'FFmpeg'],
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
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ',
      skills: ['TypeScript'],
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
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ',
      skills: ['TypeScript', 'Angular'],
      icon: 'assets/optimized/portrait/me.webp',
      iconSrcset:
        'assets/optimized/portrait/me-64.webp 64w, assets/optimized/portrait/me-128.webp 128w, assets/optimized/portrait/me.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: true,
    },
    {
      title: 'Tauchertreff-Mostviertel',
      link: 'https://tauchertreff-mostviertel.at/',
      description:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ',
      skills: ['TypeScript', 'Angular'],
      icon: 'assets/optimized/logos/tauchertreff.webp',
      iconSrcset:
        'assets/optimized/logos/tauchertreff-64.webp 64w, assets/optimized/logos/tauchertreff-128.webp 128w, assets/optimized/logos/tauchertreff.webp 216w',
      iconSizes: '(max-width: 700px) 64px, 108px',
      CircleIcon: true,
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
