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
    <div class="AboutStatCard-Metrics">
      <div class="AboutStatCard-Value">
        <component :is="icon" class="AboutStatCard-Icon" />
        <span class="u-typo-subtitle-l">{{ value }}</span>
      </div>
      <div v-if="badges.length" class="AboutStatCard-Badges">
        <BadgeBase v-for="badge in badges" :key="badge" :label="badge" />
      </div>
    </div>
    <p class="AboutStatCard-Label u-typo-body-l">{{ label }}</p>
  </div>
</template>

<style scoped lang="scss">
.AboutStatCard {
  display: flex;
  flex: 1 1 240px;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--neutral-600);
  border-radius: 24px;
  color: var(--neutral-900);
}

.AboutStatCard-Metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.AboutStatCard-Value {
  display: flex;
  align-items: center;
  gap: 16px;
  font-variant-numeric: lining-nums tabular-nums;
}

.AboutStatCard-Icon {
  flex-shrink: 0;
}

.AboutStatCard-Badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.AboutStatCard-Label {
  color: var(--neutral-600);
}
</style>
