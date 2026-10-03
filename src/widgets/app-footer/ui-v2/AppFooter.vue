<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ROUTES } from '@/shared/constants/routes'
import { useLocale } from '@/shared/i18n'
import { LinkExternal } from '@/shared/ui-v2/link-external'
import { PointBase } from '@/shared/ui-v2/point-base'
import { LinkBase } from '@/shared/ui-v2/link-base'

const { t } = useLocale()

const year = new Date().getFullYear()
// DOM-контейнер, в котором браузер раскладывает пункты футера по строкам.
const content = ref<HTMLElement>()
// Индекс соответствует пункту в DOM. У первого пункта разделителя всегда нет.
const showDividers = ref([false, false, false])
let resizeObserver: ResizeObserver | undefined

function updateDividers() {
  // Ширины текста вручную не складываем: flex-wrap уже выполнил перенос.
  // Берём только прямых детей контейнера — три пункта, а не вложенные ссылки и SVG.
  const elements = Array.from(content.value?.children ?? []) as HTMLElement[]
  showDividers.value = elements.map((element, index) => {
    const previous = elements[index - 1]
    // offsetTop — положение верхнего края пункта относительно offsetParent.
    // У этих пунктов одинаковая высота и общий offsetParent, поэтому в одной
    // flex-строке offsetTop совпадает. После переноса он отличается от предыдущего.
    // Если предыдущего пункта нет или он в другой строке, скрываем разделитель.
    return Boolean(previous && element.offsetTop === previous.offsetTop)
  })
}

onMounted(() => {
  // После монтирования DOM доступен: определяем видимость разделителей сразу.
  updateDividers()
  // Пересчитываем по готовой раскладке при изменении размеров наблюдаемых элементов.
  resizeObserver = new ResizeObserver(updateDividers)
  // Ширина контейнера меняется при изменении окна или окружающей раскладки.
  if (content.value) resizeObserver.observe(content.value)
  // Ширина пункта может измениться при смене языка или загрузке шрифта,
  // даже если ширина контейнера осталась прежней.
  for (const item of Array.from(content.value?.children ?? [])) resizeObserver.observe(item)
})

// Останавливаем наблюдение, когда футер удаляется со страницы.
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <footer class="AppFooter no-print u-typo-label-s u-container">
    <div ref="content" class="AppFooter-Content">
      <div class="AppFooter-String">
        <span>© {{ t('ui.footer.bookTitle') }} {{ year }} </span>
        <LinkBase :to="{ name: ROUTES.about.name }">{{ t('ui.footer.about') }}</LinkBase>
      </div>
      <div class="AppFooter-String">
        <PointBase
          class="AppFooter-Divider"
          :class="{ 'AppFooter-Divider_visible': showDividers[1] }"
          aria-hidden="true"
        />
        <span> {{ t('ui.footer.development') }}: </span>
        <LinkExternal href="https://github.com/gudrum1983">{{ t('ui.footer.developerName') }}</LinkExternal>
      </div>
      <div class="AppFooter-String">
        <PointBase
          class="AppFooter-Divider"
          :class="{ 'AppFooter-Divider_visible': showDividers[2] }"
          aria-hidden="true"
        />
        <span> {{ t('ui.footer.design') }}: </span>
        <LinkExternal href="https://www.behance.net/maxkamoff">{{ t('ui.footer.designerName') }}</LinkExternal>

        <!--        <LinkExternal href="https://t.me/maxsimkamenschikov">{{ t('ui.footer.designerName') }}</LinkExternal>-->
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.AppFooter {
  margin-top: 40px;

  @media (width < 360px) {
    margin-top: 16px;
  }

  &-Content {
    margin-inline: auto;
    background: var(--white);
    padding: 32px;
    color: var(--color-text-caption);
    border: 1px solid var(--neutral-200);
    max-width: 1372px;
    border-radius: 32px;
    width: 100%;
    box-shadow: 0 4px 16px 0 #0000000a;
    display: flex;
    // Браузер учитывает ширины пунктов, padding контейнера и промежутки gap.
    // Если следующий пункт с промежутком не помещается, он переходит на новую строку.
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 24px 54px;
  }

  &-String {
    position: relative;
    // Пункт не растягивается и не сжимается: его ширину определяет содержимое.
    flex: 0 0 auto;
    // Переносится весь пункт целиком, а не слова и ссылки внутри него.
    white-space: nowrap;
    gap: 8px;

    span {
      margin-right: 8px;
    }

    span:first-child {
      margin-right: 16px;
    }
  }

  &-Divider {
    // Маркер не участвует в расчёте ширины пункта и не влияет на перенос.
    // Он располагается посередине промежутка 54 px: 24 px + маркер 6 px + 24 px.
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    visibility: hidden;

    &_visible {
      // Изменение видимости не меняет размеры, поэтому не запускает новый перенос.
      visibility: visible;
    }
  }
}

@media (width < 360px) {
  .AppFooter-Content {
    flex-direction: column;
  }

  .AppFooter-String {
    max-width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: center;
  }

  .AppFooter-Divider {
    display: none;
  }
}
</style>
