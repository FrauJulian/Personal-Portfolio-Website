export type LanguageCode = 'en' | 'de';

export interface LanguageProject {
  title: string;
  link: string;
  description: string;
  icon?: string;
  iconSrcset?: string;
  iconSizes?: string;
  iconWidth?: number;
  iconHeight?: number;
  circleIcon?: boolean;
}

export interface LanguagePortraitHighlight {
  image: string;
  imageSrcset: string;
  imageSizes: string;
  imageWidth: number;
  imageHeight: number;
  text: string;
}

export interface LanguageShellPack {
  app: {
    selectorTitle: string;
    changeLanguage: string;
    changeLanguageAriaLabel: string;
    closeSelector: string;
    languageEnglish: string;
    languageGerman: string;
  };
  footer: {
    imprintLink: string;
    homeLink: string;
  };
  meta: {
    description: string;
    homeTitle: string;
    imprintTitle: string;
  };
}

export interface LanguagePack {
  home: {
    portfolioEyebrow: string;
    heroIntro: string;
    contactTitle: string;
    viewProjects: string;
    aboutMe: string;
    nextHighlightAriaLabel: string;
    nextHighlightTitle: string;
    singleHighlightTitle: string;
    portraitAltSuffix: string;
    clickHint: string;
    aboutEyebrow: string;
    aboutParagraphs: string[];
    detailToggleOpen: string;
    detailToggleClose: string;
    detailParagraphs: string[];
    getInTouch: string;
    projectsEyebrow: string;
    openProjectPrefix: string;
    projectIconAltSuffix: string;
    mailAriaLabel: string;
    phoneAriaLabel: string;
    signalAriaLabel: string;
    giteaAriaLabel: string;
    linkedinAriaLabel: string;
    skillsLabel: string;
    skillsLinkAriaLabel: string;
  };
  imprint: {
    legalEyebrow: string;
    title: string;
    intro: string;
    backToPortfolio: string;
    provider: string;
    directContact: string;
    phone: string;
    contact: string;
    abuse: string;
    privacyEyebrow: string;
    privacyTitle: string;
    privacyLeft: string;
    privacyRight: string;
    rightsEyebrow: string;
    rightsTitle: string;
    rightsLeft: string;
    rightsRight: string;
    copyrightEyebrow: string;
    copyrightTitle: string;
    copyrightLeftParagraphs: string[];
    copyrightRightParagraphs: string[];
  };
  bioTextsList: string[];
  portraitHighlights: LanguagePortraitHighlight[];
  projects: LanguageProject[];
}
