export const contentLanguageValues = ["en-ar", "en", "all"] as const;

export type ContentLanguages = (typeof contentLanguageValues)[number];

export const defaultUserSettings = {
  bio: "",
  website: "",
  country: "EG",
  publicProfile: true,
  showCountry: true,
  searchable: true,
  dmAnyone: false,
  activityStatus: false,
  prioritizeLocalFeed: true,
  regionalTrends: true,
  contentLanguages: "en-ar" as ContentLanguages,
  autoTranslate: true,
};

export type UserSettingsValues = typeof defaultUserSettings;
