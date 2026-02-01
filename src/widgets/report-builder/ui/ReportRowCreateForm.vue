<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseDatePicker from '@/shared/ui/BaseDatePicker.vue'
import BaseField from '@/shared/ui/BaseField.vue'
import MoneyField from '@/shared/ui/MoneyField.vue'
import { useCurrencyStore } from '@/app/stores/currencyStore.ts'
import BaseDropdownButton from '@/shared/ui/BaseDropdownButton.vue'

const currency = ref('RSD')
const date = ref('')
const counterparty = ref('')
const description = ref('')
const goodsAmount = ref<string | null>(null)
const servicesAmount = ref<string | null>(null)

const currentCurs = ref<number | null>(null)

const currencyStore = useCurrencyStore()
const currencyOptions = computed(() => currencyStore.currencyCodes.map((code) => ({ value: code, label: code })))

const emit = defineEmits<{
  (event: 'update:canSubmit', value: boolean): void
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

const formatDateForUi = (value: string) => {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}.${month}.${year}`
}

const summary = computed(() =>
  [date.value ? formatDateForUi(date.value) : '', counterparty.value, description.value].filter(Boolean).join(', '),
)
const totalValue = computed(() => parseMoney(goodsAmount.value) + parseMoney(servicesAmount.value))

const formatValue = (value: number | null) => (value === null ? '—' : value.toFixed(2))

const resetCalculated = () => {
  calculatedGoods.value = null
  calculatedServices.value = null
  //calculatedTotal.value = null
  calculatedGoodsConverted.value = null
  calculatedServicesConverted.value = null
  calculatedTotalConverted.value = null
  if (isCalculated.value) {
    isCalculated.value = false
    emit('update:canSubmit', false)
  }
}

const handleCalculate = () => {
  const goodsValue = parseMoney(goodsAmount.value)
  const servicesValue = parseMoney(servicesAmount.value)
  const goodsConverted = currencyStore.convertAmount(goodsValue, currency.value, 'RSD')
  const servicesConverted = currencyStore.convertAmount(servicesValue, currency.value, 'RSD')
  const totalConverted = goodsConverted + servicesConverted

  calculatedGoods.value = goodsValue
  calculatedServices.value = servicesValue
  calculatedGoodsConverted.value = goodsConverted
  calculatedServicesConverted.value = servicesConverted
  calculatedTotalConverted.value = totalConverted

  if (!isCalculated.value) {
    isCalculated.value = true
    emit('update:canSubmit', true)
  }
}

watch([date, goodsAmount, servicesAmount], resetCalculated)

onMounted(() => {
  currencyStore.hydrateFromLocalStorage()
  void currencyStore.loadCurrencies()
})
</script>

<template>
  <div class="ReportRowForm">
    <div class="ReportRowForm_Fields">
      <div class="ReportRowForm_Currency">
        <BaseDropdownButton
          class="ReportRowForm_CurrencyDropdown"
          label="Валюта"
          size="xs"
          variant="outline"
          color="primary"
          :options="currencyOptions"
          :model-value="currency"
          :placeholder="currency"
          @update:model-value="currency = $event ?? ''"
        />

        <BaseDatePicker
          name="dateCurrency"
          label="Дата"
          :model-value="date"
          @update:modelValue="date = $event ?? ''"
          required
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
      <BaseButton size="xs" color="primary" @click="handleCalculate">Рассчитать</BaseButton>
      <div v-if="currentCurs" class="ReportRowForm_Hint">{{ currentCurs }}</div>
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
  </div>
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
