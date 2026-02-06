<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { BaseButton, BaseDatePicker, BaseDropdownButton, BaseField, MoneyField } from '@/shared/ui'
import { useCurrencyStore } from '@/app/stores/currencyStore.ts'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { formatDateForUi, formatMoney } from '@/shared/lib'
import { useLocaleStore } from '@/app/stores/localeStore.ts'

/*
 * ЗВАНИЧНИ СРЕДЊИ КУРС ДИНАРА
 *ZVANIČNI SREDNJI KURS DINARA
 *OFFICIAL MIDDLE RSD EXCHANGE RATE
 * 55 символов в описании + счетчик символов
 * */

const currency = ref('')
const date = ref('')
const counterparty = ref('')
const description = ref('')
const goodsAmount = ref<string | null>(null)
const servicesAmount = ref<string | null>(null)

const currentCurs = ref<number | null>(null)
const isCalculating = ref(false)

const currencyStore = useCurrencyStore()
const metaDataStore = useMetaDataStore()
const localeStore = useLocaleStore()
const favoriteCurrencyCodes = computed(() => currencyStore.favoriteCurrencyCodes(metaDataStore.usedCurrencyCodes))

const currencyOptions = computed(() => {
  return currencyStore.currencies.map((code) => ({ value: code, label: code }))
})

export type ReportRowPayload = {
  date: string
  currency: string
  description: string
  goodsAmount: number
  servicesAmount: number
  calculatedGoodsConverted: number | null
  calculatedServicesConverted: number | null
  calculatedTotalConverted: number | null
}

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

const calculatedGoods = ref<number | null>(null)
const calculatedServices = ref<number | null>(null)
const calculatedGoodsConverted = ref<number | null>(null)
const calculatedServicesConverted = ref<number | null>(null)
const calculatedTotalConverted = ref<number | null>(null)
const isCalculated = ref(false)
const isCalculateDisabled = computed(
  () => !currency.value || !date.value || totalValue.value <= 0 || isCalculating.value,
)

const summary = computed(() =>
  [date.value ? formatDateForUi(date.value, { withTrailingDot: true }) : '', counterparty.value, description.value]
    .filter(Boolean)
    .join(', '),
)
const totalValue = computed(() => parseMoney(goodsAmount.value) + parseMoney(servicesAmount.value))

const uiLocale = computed(() =>
  localeStore.currentLocale === 'en' ? 'en' : localeStore.currentLocale === 'ru' ? 'ru' : 'sr',
)
const toCents = (value: number) => Math.round(value * 100)
const formatValue = (value: number | null) =>
  value === null ? '—' : formatMoney(toCents(value), { showMinorZeros: true, locale: uiLocale.value })

const resetCalculated = () => {
  calculatedGoods.value = null
  calculatedServices.value = null
  calculatedGoodsConverted.value = null
  calculatedServicesConverted.value = null
  calculatedTotalConverted.value = null
  if (isCalculated.value) {
    isCalculated.value = false
    emit('update:canSubmit', false)
  }
}

const handleCalculate = async () => {
  if (isCalculateDisabled.value) return

  const goodsValue = parseMoney(goodsAmount.value)
  const servicesValue = parseMoney(servicesAmount.value)
  const totalAmount = goodsValue + servicesValue

  if (totalAmount <= 0) return

  isCalculating.value = true
  currentCurs.value = null

  try {
    const conversionGoods = await currencyStore.convertAmount(currency.value, goodsValue, date.value)

    const conversionServices = await currencyStore.convertAmount(currency.value, servicesValue, date.value)

    const goodsConverted = conversionGoods.buy_middle
    const servicesConverted = conversionServices.buy_middle

    const exchangeRate = conversionGoods.rate.exchange_middle
    const totalConverted = goodsConverted + servicesConverted

    calculatedGoods.value = goodsValue
    calculatedServices.value = servicesValue
    calculatedGoodsConverted.value = goodsConverted
    calculatedServicesConverted.value = servicesConverted
    calculatedTotalConverted.value = totalConverted
    currentCurs.value = exchangeRate

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

  if (calculatedGoodsConverted.value === null || calculatedServicesConverted.value === null) {
    emit('update:canSubmit', false)
    return
  }

  emit('submit', {
    date: date.value,
    currency: currency.value,
    description: description.value,
    goodsAmount: parseMoney(goodsAmount.value),
    servicesAmount: parseMoney(servicesAmount.value),
    calculatedGoodsConverted: calculatedGoodsConverted.value,
    calculatedServicesConverted: calculatedServicesConverted.value,
    calculatedTotalConverted: calculatedTotalConverted.value,
  })
}

watch([currency, date, goodsAmount, servicesAmount], resetCalculated)

onMounted(() => {
  if (!currency.value) {
    currency.value = metaDataStore.lastUsedCurrencyCode
  }
  currencyStore.hydrateFromLocalStorage()
  void currencyStore.loadCurrencies()
})
</script>

<template>
  <form class="ReportRowForm" @submit="handleSubmit">
    <div class="ReportRowForm_Fields">
      <div class="ReportRowForm_Currency">
        <BaseDatePicker
          name="dateCurrency"
          label="Дата"
          :model-value="date"
          @update:modelValue="date = $event ?? ''"
          required
        />
        <BaseDropdownButton
          class="ReportRowForm_CurrencyDropdown"
          label="Валюта"
          size="xs"
          variant="outline"
          color="primary"
          :options="currencyOptions"
          :favorites="favoriteCurrencyCodes"
          :model-value="currency"
          @update:model-value="currency = $event ?? ''"
        />
      </div>
      <BaseField
        name="description"
        label="Описание"
        placeholder="Назначение платежа"
        :model-value="description"
        @update:modelValue="description = $event ?? ''"
      />
    </div>
    <div class="ReportRowForm_AmountFields">
      <MoneyField
        name="goodsAmount"
        label="Сумма по товарам"
        placeholder="0,00"
        :model-value="goodsAmount"
        @update:modelValue="goodsAmount = $event"
      />
      <MoneyField
        name="servicesAmount"
        label="Сумма по услугам"
        placeholder="0,00"
        :model-value="servicesAmount"
        @update:modelValue="servicesAmount = $event"
      />

      <div>
        <div class="ReportRowForm_Label">Итого</div>
        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(totalValue) }}</div>
        </div>
      </div>
    </div>

    <div class="ReportRowForm_Toolbar">
      <BaseButton size="xs" color="primary" :disabled="isCalculateDisabled" @click="handleCalculate">
        Рассчитать
      </BaseButton>
      <div v-if="isCalculated" class="ReportRowForm_Hint">ЗВАНИЧНИ СРЕДЊИ КУРС ДИНАРА {{ currentCurs }}</div>
      <div v-if="!isCalculated" class="ReportRowForm_Hint">Пересчитайте после изменений.</div>
    </div>

    <div class="ReportRowForm_Calculations">
      <div>
        <div class="ReportRowForm_Label">По товарам (RSD)</div>

        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(calculatedGoodsConverted) }}</div>
        </div>
      </div>

      <div>
        <div class="ReportRowForm_Label">По услугам (RSD)</div>

        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(calculatedServicesConverted) }}</div>
        </div>
      </div>

      <div>
        <div class="ReportRowForm_Label">Итого (RSD)</div>
        <div class="ReportRowForm_Card">
          <div class="ReportRowForm_Value">{{ formatValue(calculatedTotalConverted) }}</div>
        </div>
      </div>
    </div>

    <div>
      <div class="ReportRowForm_Label">Строка</div>
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
  border-radius: 10px;
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
