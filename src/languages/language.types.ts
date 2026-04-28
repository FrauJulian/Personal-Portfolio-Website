export type LanguageCode = 'en' | 'de';

export interface LanguageProject {
  title: string;
  link: string;
  description: string;
  skills: string[];
  icon?: string;
  iconSrcset?: string;
  iconSizes?: string;
  iconWidth?: number;
  iconHeight?: number;
  CircleIcon?: boolean;
}

export interface LanguageBioTextEntry {
  label: string;
  value: string;
}

export interface LanguagePortraitHighlight {
  image: string;
  imageSrcset: string;
  imageSizes: string;
  imageWidth: number;
  imageHeight: number;
  text: string;
}

export interface LanguagePack {
  app: {
    selectorTitle: string;
    changeLanguage: string;
    changeLanguageAriaLabel: string;
    closeSelector: string;
    languageEnglish: string;
    languageGerman: string;
  };
  footer: {
    noscriptMessage: string;
    imprintLink: string;
  };
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
    projectLanguagesAriaLabel: string;
    fallbackBioLabel: string;
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
    scopeEyebrow: string;
    scopeTitle: string;
    scopeLeft: string;
    scopeRight: string;
    privacyEyebrow: string;
    privacyTitle: string;
    privacyLeftParagraphs: string[];
    privacyRightParagraphs: string[];
    rightsEyebrow: string;
    rightsTitle: string;
    rightsLeft: string;
    rightsRight: string;
    copyrightEyebrow: string;
    copyrightTitle: string;
    copyrightLeftParagraphs: string[];
    copyrightRightParagraphs: string[];
  };
  bioTextsList: LanguageBioTextEntry[];
  portraitHighlights: LanguagePortraitHighlight[];
  projects: LanguageProject[];
}
