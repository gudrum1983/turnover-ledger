export const enInfoPage = {
  title: 'About the app',
  introText:
    'KPO Book (Paušal) is a helper tool for keeping the income ledger of an entrepreneur under the lump-sum tax regime.',
  introNote:
    'The app was created to simplify filling out the KPO book, especially when income is received in currencies other than RSD and the amounts need to be converted into dinars.',
  introFeatures:
    'With the app, you can add income records, calculate amounts in RSD, preview the completed report, print it or save it as PDF, and also export and import data.',
  introLanguages:
    'The report can be generated in Serbian Latin or Cyrillic. The app interface is available in Russian, English, and Serbian.',
  introGuideBeforeLink:
    'When creating the app, I relied on open materials about keeping the KPO book, including the guide from ',
  guideLinkText: 'srb.guide',
  introGuideAfterLink: '.',
  backToApp: 'Back to app',
  storageTitle: 'How data is stored',
  storageText:
    'Report data, the selected interface language, the report display mode, and the service currency cache are stored locally in the user browser using localStorage.',
  storageNote: 'The app does not use a separate server-side database to store user reports.',
  storageBackupNote:
    'The report can also be saved to your computer in JSON format and later restored via import. This is useful if you want to move the data to another browser, open the app on another device, or keep a backup before clearing browser data.',
  conversionTitle: 'How currency conversion works',
  conversionTextBeforeLink: 'To retrieve the list of currencies and calculate conversions, the app uses the ',
  apiLinkText: 'external API',
  conversionTextAfterLink: '',
  conversionNote:
    'Only the parameters required for the calculation are sent with the request: currency, amount, and date. The report data itself is not sent to the external API.',
  disclaimerTitle: 'Disclaimer',
  disclaimerText:
    'The app is a helper tool for preparing the KPO book and does not replace official sources, accounting advice, or your own data verification.',
  disclaimerNote:
    'The author of the app does not guarantee uninterrupted availability, accuracy, or timeliness of data obtained from the external API.',
  disclaimerRecommendationBeforeLink:
    'Before using the calculations in reporting, it is recommended to verify exchange rates and final amounts against official sources, for example the data of the ',
  bankLinkText: 'National Bank of Serbia',
  disclaimerRecommendationAfterLink: '.',
  contactTitle: 'Feedback',
  contactText: 'If you found a bug, an inaccuracy, or would like to suggest an improvement, write to:',
} as const
