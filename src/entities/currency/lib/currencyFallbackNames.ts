/**
 * Запасные названия валют, которые есть в курсовом листе НБС, но которых может не знать браузер.
 * Chrome поставляется с урезанной базой ICU: названий валют, выведенных из оборота, в ней нет,
 * и Intl.DisplayNames возвращает для них undefined.
 *
 * Сюда входят:
 * - старые валюты еврозоны: НБС до сих пор публикует их курс, пересчитывая из евро по фиксированному курсу;
 * - валюты, курс которых НБС больше не обновляет (HRK, NLG, SIT, SKK);
 * - XDR — специальные права заимствования МВФ.
 *
 * Названия взяты из CLDR (как в браузерах с полной ICU), кроме сербского XDR: в CLDR там опечатка.
 * Все названия пишутся с заглавной буквы для единообразия (в CLDR у HRK в ru и sr — со строчной).
 * Ключи — локали Intl из INTL_LOCALES.
 */
export const CURRENCY_FALLBACK_NAMES: Record<string, Record<string, string>> = {
  ru: {
    ATS: 'Австрийский шиллинг',
    BEF: 'Бельгийский франк',
    DEM: 'Немецкая марка',
    ESP: 'Испанская песета',
    FIM: 'Финская марка',
    FRF: 'Французский франк',
    GRD: 'Греческая драхма',
    HRK: 'Хорватская куна',
    IEP: 'Ирландский фунт',
    ITL: 'Итальянская лира',
    LUF: 'Люксембургский франк',
    NLG: 'Нидерландский гульден',
    PTE: 'Португальское эскудо',
    SIT: 'Словенский толар',
    SKK: 'Словацкая крона',
    XDR: 'СДР (специальные права заимствования)',
  },
  en: {
    ATS: 'Austrian Schilling',
    BEF: 'Belgian Franc',
    DEM: 'German Mark',
    ESP: 'Spanish Peseta',
    FIM: 'Finnish Markka',
    FRF: 'French Franc',
    GRD: 'Greek Drachma',
    HRK: 'Croatian Kuna',
    IEP: 'Irish Pound',
    ITL: 'Italian Lira',
    LUF: 'Luxembourgian Franc',
    NLG: 'Dutch Guilder',
    PTE: 'Portuguese Escudo',
    SIT: 'Slovenian Tolar',
    SKK: 'Slovak Koruna',
    XDR: 'Special Drawing Rights',
  },
  'sr-Latn': {
    ATS: 'Austrijski šiling',
    BEF: 'Belgijski franak',
    DEM: 'Nemačka marka',
    ESP: 'Španska pezeta',
    FIM: 'Finska marka',
    FRF: 'Francuski franak',
    GRD: 'Grčka drahma',
    HRK: 'Hrvatska kuna',
    IEP: 'Irska funta',
    ITL: 'Italijanska lira',
    LUF: 'Luksemburški franak',
    NLG: 'Holandski gulden',
    PTE: 'Portugalski eskudo',
    SIT: 'Slovenački tolar',
    SKK: 'Slovačka kruna',
    XDR: 'Posebna prava vučenja',
  },
  'sr-Cyrl': {
    ATS: 'Аустријски шилинг',
    BEF: 'Белгијски франак',
    DEM: 'Немачка марка',
    ESP: 'Шпанска пезета',
    FIM: 'Финска марка',
    FRF: 'Француски франак',
    GRD: 'Грчка драхма',
    HRK: 'Хрватска куна',
    IEP: 'Ирска фунта',
    ITL: 'Италијанска лира',
    LUF: 'Луксембуршки франак',
    NLG: 'Холандски гулден',
    PTE: 'Португалски ескудо',
    SIT: 'Словеначки толар',
    SKK: 'Словачка круна',
    XDR: 'Посебна права вучења',
  },
}
