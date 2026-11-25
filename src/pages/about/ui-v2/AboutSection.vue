<script setup lang="ts">
import { LogoBase } from '@/shared/ui-v2/logo-base'
import { LinkEmail } from '@/shared/ui-v2/link-email'
import { LinkExternal } from '@/shared/ui-v2/link-external'
import { PointBase } from '@/shared/ui-v2/point-base'
import { useLocale } from '@/shared/i18n'
import type { AboutItem } from './aboutSections'

type AboutSectionProps = {
  /** Заголовок секции, отображаемый как h2. */
  title: string
  /** Показывает логотип перед заголовком. */
  showLogo?: boolean
  /** Пункты списка с текстом, внешними ссылками и email. */
  items: readonly AboutItem[]
}

const { title, showLogo = false, items } = defineProps<AboutSectionProps>()
const { t } = useLocale()
</script>

<template>
  <section class="AboutSection">
    <div class="AboutSection-Header">
      <LogoBase v-if="showLogo" class="AboutSection-Logo" />
      <h2 class="AboutSection-Title u-typo-h2-l">{{ title }}</h2>
    </div>
    <ul class="AboutSection-List" role="list">
      <li v-for="item in items" :key="item.id" class="AboutSection-ListItem">
        <PointBase class="AboutSection-Marker" aria-hidden="true" />
        <p class="u-typo-body-l">
          <template v-for="(part, partIndex) in item.parts" :key="partIndex">
            <template v-if="part.type === 'text'">{{ t(part.key) }}</template>
            <LinkExternal v-else-if="part.type === 'external'" :href="part.href">{{ t(part.key) }}</LinkExternal>
            <template v-else>{{ ' ' }}<LinkEmail :email="part.email" /></template>
          </template>
        </p>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.AboutSection {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.AboutSection-Header {
  display: flex;
  gap: 8px;
}

.AboutSection-Logo {
  flex-shrink: 0;
}

.AboutSection-List {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.AboutSection-ListItem {
  position: relative;
  padding-inline-start: 32px;
}

.AboutSection-Marker {
  position: absolute;
  inset-inline-start: 8px;
  top: 8px;
}
</style>
