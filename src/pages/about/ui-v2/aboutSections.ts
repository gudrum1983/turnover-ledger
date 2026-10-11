import { EXCHANGE_RATE_SITE_URL, NBS_SITE_URL, SRB_GUIDE_KPO_URL } from '@/shared/constants/app'
import { PEOPLE } from '@/shared/constants/people'
import type { I18nMessageKey } from '@/shared/i18n'

type AboutMessageKey = Extract<I18nMessageKey, `ui.infoPage.${string}`>

type AboutPart =
  | { type: 'text'; key: AboutMessageKey }
  | { type: 'external'; key: AboutMessageKey; href: string }
  | { type: 'email'; email: string }

export type AboutItem = {
  id: string
  parts: readonly AboutPart[]
}

type AboutSectionData = {
  id: string
  titleKey: AboutMessageKey
  showLogo?: boolean
  items: readonly AboutItem[]
}

export const ABOUT_SECTIONS: readonly AboutSectionData[] = [
  {
    id: 'intro',
    titleKey: 'ui.infoPage.title',
    showLogo: true,
    items: [
      { id: 'introText', parts: [{ type: 'text', key: 'ui.infoPage.introText' }] },
      { id: 'introNote', parts: [{ type: 'text', key: 'ui.infoPage.introNote' }] },
      { id: 'introFeatures', parts: [{ type: 'text', key: 'ui.infoPage.introFeatures' }] },
      { id: 'introLanguages', parts: [{ type: 'text', key: 'ui.infoPage.introLanguages' }] },
      {
        id: 'introGuide',
        parts: [
          { type: 'text', key: 'ui.infoPage.introGuideBeforeLink' },
          { type: 'external', key: 'ui.infoPage.guideLinkText', href: SRB_GUIDE_KPO_URL },
          { type: 'text', key: 'ui.infoPage.introGuideAfterLink' },
        ],
      },
    ],
  },
  {
    id: 'storage',
    titleKey: 'ui.infoPage.storageTitle',
    items: [
      { id: 'storageText', parts: [{ type: 'text', key: 'ui.infoPage.storageText' }] },
      { id: 'storageNote', parts: [{ type: 'text', key: 'ui.infoPage.storageNote' }] },
      { id: 'storageBackupNote', parts: [{ type: 'text', key: 'ui.infoPage.storageBackupNote' }] },
    ],
  },
  {
    id: 'conversion',
    titleKey: 'ui.infoPage.conversionTitle',
    items: [
      {
        id: 'conversionText',
        parts: [
          { type: 'text', key: 'ui.infoPage.conversionTextBeforeLink' },
          { type: 'external', key: 'ui.infoPage.apiLinkText', href: EXCHANGE_RATE_SITE_URL },
          { type: 'text', key: 'ui.infoPage.conversionTextAfterLink' },
        ],
      },
      { id: 'conversionNote', parts: [{ type: 'text', key: 'ui.infoPage.conversionNote' }] },
    ],
  },
  {
    id: 'disclaimer',
    titleKey: 'ui.infoPage.disclaimerTitle',
    items: [
      { id: 'disclaimerText', parts: [{ type: 'text', key: 'ui.infoPage.disclaimerText' }] },
      { id: 'disclaimerNote', parts: [{ type: 'text', key: 'ui.infoPage.disclaimerNote' }] },
      {
        id: 'disclaimerRecommendation',
        parts: [
          { type: 'text', key: 'ui.infoPage.disclaimerRecommendationBeforeLink' },
          { type: 'external', key: 'ui.infoPage.bankLinkText', href: NBS_SITE_URL },
          { type: 'text', key: 'ui.infoPage.disclaimerRecommendationAfterLink' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    titleKey: 'ui.infoPage.contactTitle',
    items: [
      {
        id: 'contactText',
        parts: [
          { type: 'text', key: 'ui.infoPage.contactText' },
          { type: 'email', email: PEOPLE.developer.email },
        ],
      },
    ],
  },
]
