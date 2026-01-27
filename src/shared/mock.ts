import type { ReportRow } from '@/shared/types/report.ts'

export const MOCK: ReportRow[] = [
  {
    date: '2024-01-08',
    description: 'Доход в динарах',
    counterparty: 'ИП Лазарев',
    currency: null,
    amounts: {
      goods: { rsdCents: 350000 },
      services: { rsdCents: 150000 },
    },
  },
  {
    date: '2024-01-12',
    description: 'Продажа товара',
    counterparty: 'ООО Альфа',
    currency: 'EUR',
    amounts: {
      goods: { foreignCents: 10540, rsdCents: 1250000 },
      services: { foreignCents: 0, rsdCents: 0 },
    },
  },
  {
    date: '2024-01-15',
    description: 'Услуги консультации',
    counterparty: 'ИП Никитин',
    currency: 'USD',
    amounts: {
      goods: { foreignCents: 0, rsdCents: 0 },
      services: { foreignCents: 8820, rsdCents: 820000 },
    },
  },
  {
    date: '2024-01-21',
    description: 'Смешанный доход',
    counterparty: 'ЗАО Бета',
    currency: 'CHF',
    amounts: {
      goods: { foreignCents: 4000, rsdCents: 400000 },
      services: { foreignCents: 3000, rsdCents: 300000 },
    },
  },
  {
    date: '2024-01-28',
    description: 'Крупная партия товара',
    counterparty: 'ООО Магистраль',
    currency: 'EUR',
    amounts: {
      goods: { foreignCents: 1055050, rsdCents: 125000050 },
      services: { foreignCents: 0, rsdCents: 0 },
    },
  },
  {
    date: '2024-02-02',
    description: 'Долгосрочное обслуживание',
    counterparty: 'ИП Белова',
    currency: 'USD',
    amounts: {
      goods: { foreignCents: 0, rsdCents: 0 },
      services: { foreignCents: 1990075, rsdCents: 234000075 },
    },
  },
  {
    date: '2024-02-06',
    description: 'Суммарный оборот',
    counterparty: 'ОАО Вектор',
    currency: 'GBP',
    amounts: {
      goods: { foreignCents: 425000, rsdCents: 50000000 },
      services: { foreignCents: 638000, rsdCents: 75000000 },
    },
  },
]
