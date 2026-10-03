<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocale, SUPPORTED_LOCALES, LOCALE_META, isSupportedLocale } from '@/shared/i18n'
import { useReportScriptStore, isReportScript, REPORT_SCRIPTS, REPORT_SCRIPT_LABEL_KEY } from '@/entities/report-script'
import { ButtonWithDivider } from '@/shared/ui-v2/button-with-divider'
import { LangToggle } from '@/shared/ui-v2/lang-toggle'
import { ModalBase } from '@/shared/ui-v2/modal-base'
import { DividerBase } from '@/shared/ui-v2/divider-base'

type LanguageSettingsProps = {
  /** Размер кнопки открытия: l — все подписи, m — без подписи отчёта, s — иконка и язык интерфейса. */
  size?: 'l' | 'm' | 's'
  /** Отключает кнопку открытия настроек языка. */
  disabled?: boolean
}

const { size = 'l', disabled = false } = defineProps<LanguageSettingsProps>()

const { locale, setLocale, t } = useLocale()
const reportScriptStore = useReportScriptStore()
const { script } = storeToRefs(reportScriptStore)

const interfaceOptions = SUPPORTED_LOCALES.map((value) => ({
  value,
  tag: LOCALE_META[value].shortLabel,
  label: LOCALE_META[value].label,
}))

function getTagScripts(label: string) {
  return label.slice(0, 3)
}

const reportOptions = computed(() =>
  REPORT_SCRIPTS.map((value) => {
    const label = t(REPORT_SCRIPT_LABEL_KEY[value])
    return { value, tag: getTagScripts(label), label }
  }),
)

function updateInterfaceLanguage(value: string | undefined) {
  if (typeof value === 'string' && isSupportedLocale(value)) setLocale(value)
}

function updateReportScript(value: string | undefined) {
  if (isReportScript(value)) reportScriptStore.setScript(value)
}

const isOpen = ref(false)
const interfaceTag = computed(() => LOCALE_META[locale.value].shortLabel)
const reportTag = computed(() => reportOptions.value.find((option) => option.value === script.value)?.tag ?? '')
</script>

<template>
  <ButtonWithDivider
    class="LanguageSettings"
    :left-label="interfaceTag"
    :right-label="t('ui.languageSettings.reportShortLabel')"
    :right-value="reportTag"
    :size="size"
    :disabled="disabled"
    :aria-label="`${t('ui.languageSettings.title')}: ${interfaceTag}, ${t('ui.languageSettings.reportShortLabel')}: ${reportTag}`"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    @click="isOpen = true"
  />
  <ModalBase
    v-model:open="isOpen"
    :title="t('ui.languageSettings.title')"
    has-close-button
    should-close-on-esc
    should-close-on-overlay
  >
    <div class="LanguageSettings-Groups">
      <LangToggle
        :model-value="locale"
        @update:model-value="updateInterfaceLanguage"
        :options="interfaceOptions"
        :label="t('ui.languageSettings.interfaceLabel')"
        :description="t('ui.languageSettings.interfaceDescription')"
      />
      <DividerBase />
      <LangToggle
        :model-value="script"
        @update:model-value="updateReportScript"
        :options="reportOptions"
        :label="t('ui.languageSettings.reportLabel')"
        :description="t('ui.languageSettings.reportDescription')"
        :helper-text="t('ui.languageSettings.reportHelper')"
      />
    </div>
  </ModalBase>
</template>

<style scoped lang="scss">
.LanguageSettings-Groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
