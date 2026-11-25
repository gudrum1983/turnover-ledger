/**
 * Доли кириллицы и латиницы среди печатей с известным письмом, в целых процентах.
 * Латиница — остаток до 100, чтобы сумма всегда была ровно 100 % (без 33 % + 66 %).
 * null — если печатей с известным письмом ещё не было.
 */
export function getScriptShares(cyrillic: number, latin: number): { cyrillic: number; latin: number } | null {
  const total = cyrillic + latin
  if (total <= 0) return null

  const cyrillicShare = Math.round((cyrillic / total) * 100)
  return { cyrillic: cyrillicShare, latin: 100 - cyrillicShare }
}
