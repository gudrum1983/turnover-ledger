<script setup lang="ts">
import { ROUTES } from '@/shared/constants/routes.ts'
import { BaseLink } from '@/shared/ui'
</script>

<template>
  <div class="NotFoundPage Container">
    <div class="Typo_Display">404 страница не найдена</div>

    <div>
      <BaseLink :to="{ name: ROUTES.reportBuilder.name }" size="lg" noPadding>Спокойно — возвращаемся домой</BaseLink>
      <p>Ничего страшного, вы просто немного свернули не туда</p>
    </div>

    <div>
      <BaseLink :to="{ name: ROUTES.reportBuilder.name }" size="lg" noPadding>Polako — hajde kući</BaseLink>
      <p>Ništa strašno, samo ste malo skrenuli</p>
    </div>

    <div>
      <BaseLink :to="{ name: ROUTES.reportBuilder.name }" size="lg" noPadding>Easy — let’s go home</BaseLink>
      <p>No worries, you just took a wrong turn</p>
    </div>

    <div>
      <BaseLink :to="{ name: ROUTES.reportBuilder.name }" size="lg" noPadding>Полако — хајде кући</BaseLink>
      <p>Ништа страшно, само сте мало скренули</p>
    </div>
  </div>
</template>

<style scoped>
.NotFoundPage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2rem;
}
</style>
