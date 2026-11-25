export const srLatInfoPage = {
  title: 'O aplikaciji',
  introText:
    'KPO knjiga (paušal) je pomoćni alat za vođenje knjige evidencije prihoda preduzetnika na paušalnom oporezivanju.',
  introNote:
    'Aplikacija je napravljena da olakša popunjavanje KPO knjige, posebno kada prihodi stižu u valuti koja nije RSD, a iznose treba preračunati u dinare.',
  introFeatures:
    'Pomoću aplikacije možete dodavati zapise o prihodima, obračunavati iznose u RSD, pregledati gotov izveštaj, štampati ga ili sačuvati kao PDF, kao i izvoziti i uvoziti podatke.',
  introLanguages:
    'Izveštaj se može formirati na srpskoj latinici ili ćirilici. Interfejs aplikacije dostupan je na ruskom, engleskom i srpskom jeziku.',
  introGuideBeforeLink:
    'Aplikacija je pokrenuta 1. maja 2026. godine. Prilikom njene izrade oslanjala sam se na otvorene materijale o vođenju KPO knjige, uključujući i vodič sa sajta ',
  guideLinkText: 'srb.guide',
  introGuideAfterLink: '.',
  backToApp: 'Na početnu',
  storageTitle: 'Kako se čuvaju podaci',
  storageText:
    'Podaci izveštaja, izabrani jezik interfejsa, režim prikaza izveštaja i pomoćni keš valuta čuvaju se lokalno u pregledaču korisnika pomoću localStorage.',
  storageNote: 'Aplikacija ne koristi posebnu serversku bazu podataka za čuvanje korisničkih izveštaja.',
  storageStatsNote:
    'Za statistiku aplikacija šalje samo anonimne brojače: posetu i otvaranje pregleda izveštaja (najviše jednom dnevno), štampu (sa pismom izveštaja) i preračun iznosa. Uz pregled i štampu šalje se i jezik interfejsa. Iznosi, datumi, valute i podaci izveštaja ne čuvaju se u statistici.',
  storageBackupNote:
    'Izveštaj takođe možete sačuvati na računar u JSON formatu i kasnije ga vratiti kroz uvoz. To je korisno ako želite da prenesete podatke u drugi pregledač, otvorite aplikaciju na drugom uređaju ili sačuvate rezervnu kopiju pre brisanja podataka pregledača.',
  conversionTitle: 'Kako radi konverzija valuta',
  conversionTextBeforeLink: 'Za dobijanje liste valuta i obračun konverzije aplikacija koristi ',
  apiLinkText: 'eksterni API',
  conversionTextAfterLink: '',
  conversionNote:
    'U zahtevu se šalju samo parametri potrebni za obračun: valuta, iznos i datum. Podaci samog izveštaja se ne šalju eksternom API-ju.',
  disclaimerTitle: 'Ograničenje odgovornosti',
  disclaimerText:
    'Aplikacija je pomoćni alat za pripremu KPO knjige i ne zamenjuje zvanične izvore, knjigovodstveni savet ili samostalnu proveru podataka.',
  disclaimerNote:
    'Autor aplikacije ne garantuje neprekidnu dostupnost, tačnost i ažurnost podataka dobijenih iz eksternog API-ja.',
  disclaimerRecommendationBeforeLink:
    'Pre korišćenja obračuna u izveštavanju preporučuje se da kurseve i konačne iznose proverite prema zvaničnim izvorima, na primer prema podacima ',
  bankLinkText: 'Narodne banke Srbije',
  disclaimerRecommendationAfterLink: '.',
  statsTitle: 'Statistika',
  statsNote: 'Statistika je anonimna: samo broj, bez iznosa i podataka izveštaja',
  statsVisits: 'Poseta',
  statsPrints: 'Izveštaja',
  statsConversions: 'Konverzija',
  statsSince: 'Početak statistike',
  statsCyrillicShort: 'Ћир {share}',
  statsLatinShort: 'Lat {share}',
  contactTitle: 'Povratne informacije',
  contactText: 'Ako ste pronašli grešku, netačnost ili želite da predložite poboljšanje, pišite na:',
} as const
