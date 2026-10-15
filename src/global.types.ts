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
  siteUrl: string;
  contactMail: string;
  abuseMail: string;
  linkedinSkillsUrl: string;
  signalUrl: string;
  contactPhone: string;
  hrefContactPhone: string;
  birthdate: string;
  address: ImprintData;
}
