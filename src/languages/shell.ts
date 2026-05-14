import type { LanguageShellPack } from './language.types';

export const enShellLanguage: LanguageShellPack = {
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
};

export const deShellLanguage: LanguageShellPack = {
  app: {
    selectorTitle: 'Sprache auswählen',
    changeLanguage: 'Sprache',
    changeLanguageAriaLabel: 'Sprache ändern',
    closeSelector: 'Sprachauswahl schließen',
    languageEnglish: 'Englisch',
    languageGerman: 'Deutsch',
  },
  footer: {
    noscriptMessage: 'Bitte aktiviere JavaScript um alles zu sehen.',
    imprintLink: 'Impressum',
  },
};
