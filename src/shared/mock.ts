import type { ReportRow } from '@/shared/types/report.ts'

export const MOCK: ReportRow[] = [
  {
    id: 'row-2024-01-08-1',
    date: '2024-01-08',
    description: 'Доход в динарах',
    currency: 'RSD',
    amounts: {
      goods: { foreignCents: 350000, rsdCents: 350000 },
      services: { foreignCents: 150000, rsdCents: 150000 },
    },
  },
  {
    id: 'row-2024-01-12-1',
    date: '2024-01-12',
    description: 'Продажа товара',
    currency: 'EUR',
    amounts: {
      goods: { foreignCents: 10540, rsdCents: 1250000 },
      services: { foreignCents: 0, rsdCents: 0 },
    },
  },
  {
    id: 'row-2024-01-15-1',
    date: '2024-01-15',
    description: 'Услуги консультации',
    currency: 'USD',
    amounts: {
      goods: { foreignCents: 0, rsdCents: 0 },
      services: { foreignCents: 8820, rsdCents: 820000 },
    },
  },
  {
    id: 'row-2024-01-21-1',
    date: '2024-01-21',
    description: 'Смешанный доход',
    currency: 'CHF',
    amounts: {
      goods: { foreignCents: 4000, rsdCents: 400000 },
      services: { foreignCents: 3000, rsdCents: 300000 },
    },
  },
  {
    id: 'row-2024-01-28-1',
    date: '2024-01-28',
    description: 'Крупная партия товара',
    currency: 'EUR',
    amounts: {
      goods: { foreignCents: 1055050, rsdCents: 125000050 },
      services: { foreignCents: 0, rsdCents: 0 },
    },
  },
  {
    id: 'row-2024-02-02-1',
    date: '2024-02-02',
    description: 'Долгосрочное обслуживание',
    currency: 'USD',
    amounts: {
      goods: { foreignCents: 0, rsdCents: 0 },
      services: { foreignCents: 1990075, rsdCents: 234000075 },
    },
  },
  {
    id: 'row-2024-02-06-1',
    date: '2024-02-06',
    description: 'Суммарный оборот',
    currency: 'GBP',
    amounts: {
      goods: { foreignCents: 425000, rsdCents: 50000000 },
      services: { foreignCents: 638000, rsdCents: 75000000 },
    },
  },
]
