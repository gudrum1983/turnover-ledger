<script setup lang="ts">
import { ROUTES } from '@/shared/constants/routes.ts'
import { LinkBase } from '@/shared/ui/link-base'
</script>

<template>
  <div class="NotFoundPage Container">
    <div class="Typo_Display">404 страница не найдена</div>

    <div>
      <LinkBase :to="{ name: ROUTES.reportBuilder.name }" size="lg">Спокойно — возвращаемся домой</LinkBase>
      <p>Ничего страшного, вы просто немного свернули не туда</p>
    </div>

    <div>
      <LinkBase :to="{ name: ROUTES.reportBuilder.name }" size="lg">Polako — hajde kući</LinkBase>
      <p>Ništa strašno, samo ste malo skrenuli</p>
    </div>

    <div>
      <LinkBase :to="{ name: ROUTES.reportBuilder.name }" size="lg">Easy — let’s go home</LinkBase>
      <p>No worries, you just took a wrong turn</p>
    </div>

    <div>
      <LinkBase :to="{ name: ROUTES.reportBuilder.name }" size="lg">Полако — хајде кући</LinkBase>
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
