<script setup lang="ts">
import type { Component } from 'vue'
import { BadgeBase } from '@/shared/ui-v2/badge-base'

type AboutStatCardProps = {
  /** Иконка слева от числа */
  icon: Component
  /** Уже отформатированное число */
  value: string
  /** Подпись под числом */
  label: string
  /** Пояснения к числу в бейджах справа, например «20 кир», «4 лат» */
  badges?: readonly string[]
}

const { icon, value, label, badges = [] } = defineProps<AboutStatCardProps>()
</script>

<template>
  <div class="AboutStatCard">
    <!-- Слева число и подпись, справа бейджи: в узкой карточке они встают колонкой, не сдвигая число -->
    <div class="AboutStatCard-Main">
      <div class="AboutStatCard-Value">
        <component :is="icon" class="AboutStatCard-Icon" />
        <span class="u-typo-subtitle-l">{{ value }}</span>
      </div>
      <p class="AboutStatCard-Label u-typo-body-l">{{ label }}</p>
    </div>
    <div v-if="badges.length" class="AboutStatCard-Badges">
      <BadgeBase v-for="badge in badges" :key="badge" :label="badge" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.AboutStatCard {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--neutral-600);
  border-radius: 24px;
  color: var(--neutral-900);
}

.AboutStatCard-Main {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
}

.AboutStatCard-Value {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
  font-variant-numeric: lining-nums tabular-nums;
}

.AboutStatCard-Icon {
  flex-shrink: 0;
}

.AboutStatCard-Badges {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  // Первый бейдж — по центру строки с числом: строка 24px × 1.3 ≈ 31px, бейдж 14px × 1.3 + 8px ≈ 26px.
  padding-block-start: 2.5px;
}

.AboutStatCard-Label {
  color: var(--neutral-600);
  // Подпись в одну строку: лучше перенести всю карточку, чем ломать «Старт статистики» на две строки.
  white-space: nowrap;
}
</style>
