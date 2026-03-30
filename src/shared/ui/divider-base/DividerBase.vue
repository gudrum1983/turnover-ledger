<script setup lang="ts">
import { computed } from 'vue'
import { toPxString } from '@/shared/lib/number/number'

type DividerLineStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'

type DividerColorToken =
  | 'base'
  | 'table'
  | 'default'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ring'
  | 'disabled'
  | 'table-cell'

type DividerLabelPosition = 'left' | 'center' | 'right'

type DividerProps = {
  thickness?: number
  lineStyle?: DividerLineStyle
  color?: DividerColorToken
  isVertical?: boolean
  label?: string
  labelPosition?: DividerLabelPosition
  labelOffset?: number
  edgeOffset?: number
}

const {
  thickness = 1,
  lineStyle = 'solid',
  color = 'default',
  isVertical = false,
  label = '',
  labelPosition = 'center',
  labelOffset = 0,
  edgeOffset = 0,
} = defineProps<DividerProps>()

const thicknessPx = computed(() => toPxString(thickness, { min: 1, max: 20 }))
const labelOffsetPx = computed(() => toPxString(labelOffset, { min: 0 }))
const edgeOffsetPx = computed(() => toPxString(edgeOffset, { min: 0 }))

const isLabelVisible = computed(() => Boolean(label) && !isVertical)

const styleVars = computed(() => ({
  '--divider-color': `var(--color-border-${color})`,
  '--label-offset': labelOffsetPx.value,
  '--edge-offset': edgeOffsetPx.value,
}))
</script>

<template>
  <div
    class="DividerBase"
    :class="[
      `DividerBase_style_${lineStyle}`,
      `DividerBase_labelPosition_${labelPosition}`,
      { DividerBase_isVertical: isVertical, DividerBase_hasLabel: isLabelVisible },
    ]"
    :style="styleVars"
    role="separator"
    :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
  >
    <span v-if="isLabelVisible" class="DividerBase_Label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.DividerBase {
  --divider-style: solid;
  --divider-thickness: v-bind(thicknessPx);
  --label-offset: 0px;
  --label-gap: 8px;
  --edge-offset: 0px;

  width: 100%;
  height: 0;
  position: relative;
  display: flex;
  align-items: center;
  padding-inline: var(--edge-offset);
  box-sizing: border-box;

  &::before,
  &::after {
    content: '';
    border-top: var(--divider-thickness) var(--divider-style) var(--divider-color);
    flex: 1 1 0;
  }

  &_hasLabel {
    height: auto;

    &::before {
      margin-right: var(--label-gap);
    }

    &::after {
      margin-left: var(--label-gap);
    }
  }

  &_Label {
    white-space: nowrap;
  }

  &_labelPosition_left::before {
    flex: 0 0 var(--label-offset);
  }

  &_labelPosition_right::after {
    flex: 0 0 var(--label-offset);
  }

  &_isVertical {
    width: 0;
    height: 100%;
    border-top: none;
    border-right: var(--divider-thickness) var(--divider-style) var(--divider-color);
    display: block;
    padding-inline: 0;

    &::before,
    &::after {
      content: none;
    }
  }

  &_style {
    &_solid {
      --divider-style: solid;
    }
    &_dashed {
      --divider-style: dashed;
    }
    &_dotted {
      --divider-style: dotted;
    }
    &_double {
      --divider-style: double;
    }
    &_groove {
      --divider-style: groove;
    }
    &_ridge {
      --divider-style: ridge;
    }
  }
}
</style>
