<script setup lang="ts">
import { useId } from 'vue'
import LangToggleButton from './LangToggleButton.vue'

type LangToggleOption = {
  value: string
  tag: string
  label: string
}

type LangToggleProps = {
  /* Значения кнопок переключения */
  options: readonly LangToggleOption[]
  /* Заголовок */
  label: string
  /* Описание */
  description: string
  /* Дополнительный текст */
  helperText?: string
  /** Растягивает на всю ширину контейнера */
  fullWidth?: boolean
}

const { options, label, description, helperText, fullWidth = false } = defineProps<LangToggleProps>()

const descriptionId = useId()
const model = defineModel<string>()
</script>

<template>
  <fieldset class="LangToggle" :class="{ LangToggle_fullWidth: fullWidth }" :aria-describedby="descriptionId">
    <legend class="LangToggle-Legend u-typo-subtitle-m">{{ label }}</legend>
    <div class="LangToggle-Content">
      <p :id="descriptionId" class="LangToggle-Description u-typo-label-s">{{ description }}</p>
      <div class="LangToggle-Options">
        <LangToggleButton
          v-for="option in options"
          :key="option.value"
          :tag="option.tag"
          :label="option.label"
          :selected="model === option.value"
          @select="model = option.value"
        />
      </div>
      <span v-if="helperText" class="LangToggle-HelpText u-typo-label-s">{{ helperText }}</span>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.LangToggle {
  min-width: 0;
  width: fit-content;
  margin: 0;
  padding: 0;
  border: 0;

  &-Legend {
    padding: 0;
    margin-bottom: 4px;
  }

  &-Content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-Description {
    margin: 0;
    display: block;
    color: var(--neutral-600);
  }

  &-HelpText {
    display: block;
    color: var(--neutral-500);
  }

  &-Options {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
}

.LangToggle_fullWidth {
  width: 100%;
}
</style>
