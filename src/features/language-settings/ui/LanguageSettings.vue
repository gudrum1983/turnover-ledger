<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
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
const groupsViewport = ref<HTMLElement>()
const groupsContent = ref<HTMLElement>()
let heightAnimation: Animation | undefined
let heightUpdate = 0

function resetHeight() {
  heightUpdate += 1
  heightAnimation?.cancel()
  heightAnimation = undefined
  groupsViewport.value?.style.removeProperty('height')
}

watch(locale, async () => {
  const viewport = groupsViewport.value
  if (!isOpen.value || !viewport) return

  const update = ++heightUpdate
  const from = viewport.getBoundingClientRect().height
  heightAnimation?.cancel()
  heightAnimation = undefined
  viewport.style.height = `${from}px`

  await nextTick()
  if (update !== heightUpdate || !isOpen.value || !groupsContent.value) return

  const to = groupsContent.value.getBoundingClientRect().height
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || Math.abs(to - from) < 1) {
    viewport.style.removeProperty('height')
    return
  }

  const styles = getComputedStyle(viewport)
  const durationToken = styles.getPropertyValue('--transition-duration-locale').trim()
  const duration = parseFloat(durationToken) * (durationToken.endsWith('ms') ? 1 : 1000)
  viewport.style.height = `${to}px`
  const animation = viewport.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration,
    easing: styles.getPropertyValue('--transition-easing-locale').trim(),
  })
  heightAnimation = animation
  animation.onfinish = () => {
    if (heightAnimation !== animation) return
    viewport.style.removeProperty('height')
    heightAnimation = undefined
  }
})

watch(isOpen, (open) => {
  if (!open) resetHeight()
})

onBeforeUnmount(resetHeight)

function prepareLeavingGroups(element: Element) {
  if (!(element instanceof HTMLElement)) return
  if (element.contains(document.activeElement)) groupsViewport.value?.focus()
  element.inert = true
  element.setAttribute('aria-hidden', 'true')
}

function restoreGroupsFocus(element: Element) {
  if (document.activeElement === groupsViewport.value) {
    element.querySelector<HTMLElement>('button:not(:disabled)')?.focus()
  }
}
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
    animate-title
    has-close-button
    should-close-on-esc
    should-close-on-overlay
  >
    <div ref="groupsViewport" class="LanguageSettings-Viewport" tabindex="-1">
      <Transition
        enter-from-class="LanguageSettings-Groups_enterFrom"
        enter-active-class="LanguageSettings-Groups_enterActive"
        leave-active-class="LanguageSettings-Groups_leaveActive"
        leave-to-class="LanguageSettings-Groups_leaveTo"
        @before-leave="prepareLeavingGroups"
        @after-enter="restoreGroupsFocus"
      >
        <div :key="locale" ref="groupsContent" class="LanguageSettings-Groups">
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
      </Transition>
    </div>
  </ModalBase>
</template>

<style scoped lang="scss">
.LanguageSettings-Viewport {
  position: relative;
  overflow: clip;
  overflow-clip-margin: 4px;
  outline: none;
}

.LanguageSettings-Groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.LanguageSettings-Groups_enterActive,
.LanguageSettings-Groups_leaveActive {
  transition:
    opacity var(--transition-locale),
    transform var(--transition-locale);
}

.LanguageSettings-Groups_leaveActive {
  position: absolute;
  top: 0;
  width: 100%;
  pointer-events: none;
}

.LanguageSettings-Groups_enterFrom {
  opacity: 0;
  transform: translateX(12px);
}

.LanguageSettings-Groups_leaveTo {
  opacity: 0;
  transform: translateX(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .LanguageSettings-Groups_enterFrom,
  .LanguageSettings-Groups_leaveTo {
    transform: none;
  }
}
</style>
