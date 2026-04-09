<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ButtonBase } from '@/shared/ui/button-base'
import { ButtonDropdown } from '@/shared/ui/button-dropdown'
import { FieldCounter } from '@/shared/ui/field-counter'
import { FieldDate } from '@/shared/ui/field-date'
import { FieldMoney } from '@/shared/ui/field-money'
import { useCurrencyStore } from '@/entities/currency'
import { useReportStore } from '@/entities/report'
import { formatDateForUi, formatMoney } from '@/shared/lib'
import { useLocale, useLocaleStore } from '@/shared/i18n'

/*
 * ЗВАНИЧНИ СРЕДЊИ КУРС ДИНАРА
 *ZVANIČNI SREDNJI KURS DINARA
 *OFFICIAL MIDDLE RSD EXCHANGE RATE
 * */

const currency = ref('')
const date = ref('')
const counterparty = ref('')
const description = ref('')
const goodsAmount = ref<string | null>(null)
const servicesAmount = ref<string | null>(null)

export type ReportRowFormInitialValue = {
  date?: string
  currency?: string
  description?: string
  goodsAmount?: number | null
  servicesAmount?: number | null
  goodsAmountRsd?: number | null
  servicesAmountRsd?: number | null
  totalAmountRsd?: number | null
  exchangeRate?: number | null
}

const exchangeRate = ref<number | null>(null)
const isCalculating = ref(false)

const currencyStore = useCurrencyStore()
const reportStore = useReportStore()
const localeStore = useLocaleStore()
const { t } = useLocale()
const favoriteCurrencyCodes = computed(() => currencyStore.favoriteCurrencyCodes(reportStore.usedCurrencyCodes))

const currencyOptions = computed(() => {
  return currencyStore.currencies.map((code) => ({ value: code, label: code }))
})

const moneyLocale = computed(() => {
  if (localeStore.currentLocale === 'en') return 'en-US'
  if (localeStore.currentLocale === 'srLat' || localeStore.currentLocale === 'srCyr') return 'sr-RS'

  return 'ru-RU'
})

export type ReportRowPayload = {
  date: string
  currency: string
  description: string
  goodsAmount: number
  servicesAmount: number
  exchangeRate: number | null
  goodsAmountRsd: number | null
  servicesAmountRsd: number | null
  totalAmountRsd: number | null
}

type ReportRowCreateFormProps = {
  initialValue?: ReportRowFormInitialValue | null
}

const props = withDefaults(defineProps<ReportRowCreateFormProps>(), {
  initialValue: null,
})

const emit = defineEmits<{
  (event: 'update:canSubmit', value: boolean): void
  (event: 'submit', payload: ReportRowPayload): void
}>()

const parseMoney = (value: string | null) => {
  if (!value) {
    return 0
  }

  const normalized = value.replace(/\s/g, '').replace(',', '.')
  const result = Number.parseFloat(normalized)

  return Number.isFinite(result) ? result : 0
}

const goodsAmountRsd = ref<number | null>(null)
const servicesAmountRsd = ref<number | null>(null)
const totalAmountRsd = ref<number | null>(null)
const isCalculated = ref(false)
const isApplyingInitialValue = ref(false)
const isCalculateDisabled = computed(
  () => !currency.value || !date.value || totalValue.value <= 0 || isCalculating.value,
)

const summary = computed(() =>
  [date.value ? formatDateForUi(date.value) : '', counterparty.value, description.value].filter(Boolean).join(', '),
)
const totalValue = computed(() => parseMoney(goodsAmount.value) + parseMoney(servicesAmount.value))

const uiLocale = computed(() => localeStore.currentLocale)
const toCents = (value: number) => Math.round(value * 100)
const formatValue = (value: number | null) =>
  value === null ? '—' : formatMoney(toCents(value), { showMinorZeros: true, locale: uiLocale.value })

const formatInputMoney = (value: number | null | undefined): string | null => {
  if (value === null || value === undefined) {
    return null
  }
  return String(value)
}

const clearCalculated = () => {
  goodsAmountRsd.value = null
  servicesAmountRsd.value = null
  totalAmountRsd.value = null
  exchangeRate.value = null
  isCalculated.value = false
  emit('update:canSubmit', false)
}

const resetCalculated = () => {
  if (isApplyingInitialValue.value) {
    return
  }
  clearCalculated()
}

const handleCalculate = async () => {
  if (isCalculateDisabled.value) return

  const goodsValue = parseMoney(goodsAmount.value)
  const servicesValue = parseMoney(servicesAmount.value)
  const totalAmount = goodsValue + servicesValue

  if (totalAmount <= 0) return

  isCalculating.value = true
  exchangeRate.value = null

  try {
    const conversionGoods =
      goodsValue > 0 ? await currencyStore.convertAmount(currency.value, goodsValue, date.value) : null

    const conversionServices =
      servicesValue > 0 ? await currencyStore.convertAmount(currency.value, servicesValue, date.value) : null

    const goodsConverted = conversionGoods ? conversionGoods.buy_middle : 0
    const servicesConverted = conversionServices ? conversionServices.buy_middle : 0

    const totalConverted = goodsConverted + servicesConverted

    const exchangeRateGoods = conversionGoods?.rate.exchange_middle
    const exchangeRateServices = conversionServices?.rate.exchange_middle
    const resolvedExchangeRate = exchangeRateGoods ?? exchangeRateServices

    goodsAmountRsd.value = goodsConverted
    servicesAmountRsd.value = servicesConverted
    totalAmountRsd.value = totalConverted
    exchangeRate.value = resolvedExchangeRate ?? 0

    if (!isCalculated.value) {
      isCalculated.value = true
      emit('update:canSubmit', true)
    }
  } finally {
    isCalculating.value = false
  }
}

const handleSubmit = (event: Event) => {
  event.preventDefault()

  if (!isCalculated.value) {
    emit('update:canSubmit', false)
    return
  }

  if (goodsAmountRsd.value === null || servicesAmountRsd.value === null) {
    emit('update:canSubmit', false)
    return
  }

  emit('submit', {
    date: date.value,
    currency: currency.value,
    description: description.value,
    goodsAmount: parseMoney(goodsAmount.value),
    servicesAmount: parseMoney(servicesAmount.value),
    exchangeRate: exchangeRate.value,
    goodsAmountRsd: goodsAmountRsd.value,
    servicesAmountRsd: servicesAmountRsd.value,
    totalAmountRsd: totalAmountRsd.value,
  })
}

const applyInitialValue = (initialValue: ReportRowFormInitialValue | null) => {
  isApplyingInitialValue.value = true
  date.value = initialValue?.date ?? ''
  currency.value = initialValue?.currency ?? reportStore.lastUsedCurrencyCode
  description.value = initialValue?.description ?? ''
  goodsAmount.value = formatInputMoney(initialValue?.goodsAmount)
  servicesAmount.value = formatInputMoney(initialValue?.servicesAmount)

  const hasPrecalculatedValues =
    initialValue?.goodsAmountRsd !== undefined && initialValue?.servicesAmountRsd !== undefined

  if (hasPrecalculatedValues) {
    goodsAmountRsd.value = initialValue?.goodsAmountRsd ?? null
    servicesAmountRsd.value = initialValue?.servicesAmountRsd ?? null
    totalAmountRsd.value =
      initialValue?.totalAmountRsd ?? (initialValue?.goodsAmountRsd ?? 0) + (initialValue?.servicesAmountRsd ?? 0)
    exchangeRate.value = initialValue?.exchangeRate ?? null
    isCalculated.value = true
    emit('update:canSubmit', true)
  } else {
    clearCalculated()
  }

  void nextTick(() => {
    isApplyingInitialValue.value = false
  })
}

watch([currency, date, goodsAmount, servicesAmount], resetCalculated)
watch(
  () => props.initialValue,
  (next) => {
    applyInitialValue(next)
  },
  { immediate: true },
)

onMounted(() => {
  currencyStore.hydrateFromLocalStorage()
  void currencyStore.loadCurrencies()
})
</script>

<template>
  <form class="ReportRowForm" @submit="handleSubmit" v-autofocus>
    <div class="ReportRowForm_Fields">
      <div class="ReportRowForm_Currency">
        <FieldDate
          name="dateCurrency"
          :label="t('ui.reportRowForm.date')"
          :model-value="date"
          :date-fns-locale="localeStore.dateFnsLocale"
          @update:modelValue="date = $event ?? ''"
          required
        />
        <ButtonDropdown
          class="ReportRowForm_CurrencyDropdown"
          :label="t('ui.reportRowForm.currency')"
          size="xs"
          variant="outlined"
          color="default"
          :options="currencyOptions"
          :favorites="favoriteCurrencyCodes"
          :model-value="currency"
          @update:model-value="currency = $event ?? ''"
        />
      </div>
      <FieldCounter
        :maxLength="55"
        name="description"
        :label="t('ui.reportRowForm.description')"
        :placeholder="t('ui.reportRowForm.descriptionPlaceholder')"
        :model-value="description"
        @update:modelValue="description = $event ?? ''"
      />
    </div>
    <div class="ReportRowForm_AmountFields">
      <FieldMoney
        name="goodsAmount"
        :label="t('ui.reportRowForm.goodsAmount')"
        placeholder="0,00"
        :model-value="goodsAmount"
        :locale="moneyLocale"
        @update:modelValue="goodsAmount = $event"
      />
      <FieldMoney
        name="servicesAmount"
        :label="t('ui.reportRowForm.servicesAmount')"
        placeholder="0,00"
        :model-value="servicesAmount"
        :locale="moneyLocale"
        @update:modelValue="servicesAmount = $event"
      />

      <div>
        <div class="ReportRowForm_Label">{{ t('ui.reportRowForm.total') }}</div>
        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(totalValue) }}</div>
        </div>
      </div>
    </div>

    <div class="ReportRowForm_Toolbar">
      <ButtonBase size="xs" color="primary" :disabled="isCalculateDisabled" @click="handleCalculate">
        {{ t('ui.reportRowForm.calculate') }}
      </ButtonBase>
      <div v-if="isCalculated" class="ReportRowForm_Hint">
        {{ t('ui.reportRowForm.officialRatePrefix') }} {{ exchangeRate ?? '—' }}
      </div>
      <div v-if="!isCalculated" class="ReportRowForm_Hint">{{ t('ui.reportRowForm.recalculateHint') }}</div>
    </div>

    <div class="ReportRowForm_Calculations">
      <div>
        <div class="ReportRowForm_Label">{{ t('ui.reportRowForm.goodsRsd') }}</div>

        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(goodsAmountRsd) }}</div>
        </div>
      </div>

      <div>
        <div class="ReportRowForm_Label">{{ t('ui.reportRowForm.servicesRsd') }}</div>

        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(servicesAmountRsd) }}</div>
        </div>
      </div>

      <div>
        <div class="ReportRowForm_Label">{{ t('ui.reportRowForm.totalRsd') }}</div>
        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(totalAmountRsd) }}</div>
        </div>
      </div>
    </div>

    <div>
      <div class="ReportRowForm_Label">{{ t('ui.reportRowForm.row') }}</div>
      <div class="ReportRowForm_Summary">
        <div class="ReportRowForm_Value">{{ summary || '—' }}</div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.ReportRowForm {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ReportRowForm_Fields {
  display: flex;
  width: 100%;
  gap: 16px;
}

.ReportRowForm_Currency {
  display: flex;
  min-width: calc(110px + 160px + 16px);
  gap: 16px;

  .ReportRowForm_CurrencyDropdown {
    min-width: 110px;
  }
}

.ReportRowForm_AmountFields {
  gap: 16px;
  display: grid;
  align-items: end;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.ReportRowForm_Calculations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.ReportRowForm_Toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ReportRowForm_Hint {
  color: var(--color-text-disabled);
  font: var(--font-medium-text-xs);
}

.ReportRowForm_Card {
  height: fit-content;
  border: 1px dashed var(--color-border-default);
  background: var(--color-background-surface-accent);
  display: flex;
  flex-direction: row;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 4px;
  color: var(--color-text-default);
}

.ReportRowForm_Summary {
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px dashed var(--color-border-default);
  background: var(--color-background-surface-accent);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ReportRowForm_Label {
  color: var(--color-text-disabled);
  font: var(--font-medium-text-xs);
}

.ReportRowForm_Value {
  color: var(--color-text-default);
  font: var(--font-medium-text-sm);
  line-height: 1.15;
  word-break: break-word;
}
</style>
