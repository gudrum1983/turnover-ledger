<script setup lang="ts">
import { ROUTES } from '@/shared/constants/routes.ts'
</script>

<template>
  <div class="NotFoundPage Container">
    <div class="Typo_Display">404 страница не найдена</div>

    <div>
      <RouterLink :to="{ name: ROUTES.reportBuilder.name }">Спокойно — возвращаемся домой</RouterLink>
      <p>Ничего страшного, вы просто немного свернули не туда</p>
    </div>

    <div>
      <RouterLink :to="{ name: ROUTES.reportBuilder.name }">Polako — hajde kući</RouterLink>
      <p>Ništa strašno, samo ste malo skrenuli</p>
    </div>

    <div>
      <RouterLink :to="{ name: ROUTES.reportBuilder.name }">Easy — let’s go home</RouterLink>
      <p>No worries, you just took a wrong turn</p>
    </div>

    <div>
      <RouterLink :to="{ name: ROUTES.reportBuilder.name }">Полако — хајде кући</RouterLink>
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
