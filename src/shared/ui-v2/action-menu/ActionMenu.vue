<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, type ComponentPublicInstance } from 'vue'
import { ButtonIcon } from '@/shared/ui-v2/button-icon'
import { IconMenu } from '@/shared/ui-v2/icons'
import type { ActionMenuItem } from './types'

type Props = {
  /** Пункты меню */
  items: ActionMenuItem[]
  /** Доступное название кнопки и меню для программ экранного доступа */
  ariaLabel: string
  /** Визуальный вариант кнопки-триггера */
  triggerVariant?: 'page' | 'card'
}

const { items, ariaLabel, triggerVariant = 'card' } = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select', value: string): void
}>()

// Зазор между меню и кнопкой и минимальный отступ меню от краёв окна.
const MENU_GAP = 4
const VIEWPORT_PADDING = 8

const menuId = useId()
const isOpen = ref(false)
const triggerRef = ref<ComponentPublicInstance | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const itemElements: HTMLButtonElement[] = []
const position = ref({ top: 0, left: 0, origin: '0 0' })

const getTriggerElement = () => triggerRef.value?.$el as HTMLElement | undefined

function setItemRef(element: Element | ComponentPublicInstance | null, index: number) {
  if (element instanceof HTMLButtonElement) itemElements[index] = element
}

// Индекс по кругу: -1 — последний пункт, length — первый.
function focusItem(index: number) {
  const count = items.length
  if (count === 0) return
  itemElements[(index + count) % count]?.focus()
}

// Меню рендерится в body (Teleport) с position: fixed, поэтому его не обрезают
// overflow родителей (скролл таблицы, PaperBlock и т. п.).
// Меню открывается слева от кнопки: правый верхний угол меню — у левого верхнего угла кнопки, с зазором MENU_GAP.
// Если слева не хватает места, меню открывается справа от кнопки (левый верхний угол — у правого верхнего угла).
// Если снизу не хватает места, меню выравнивается по низу кнопки и раскрывается вверх.
// origin — точка внутри меню, из которой оно «вырастает» при анимации (угол у кнопки).
function updatePosition() {
  const trigger = getTriggerElement()
  const menu = menuRef.value
  if (!trigger || !menu) return

  // offsetWidth/offsetHeight не учитывают transform, поэтому анимация масштаба не искажает расчёт.
  const triggerRect = trigger.getBoundingClientRect()
  const { offsetWidth: width, offsetHeight: height } = menu

  const leftSide = triggerRect.left - MENU_GAP - width
  const opensLeft = leftSide >= VIEWPORT_PADDING
  const anchorX = opensLeft ? triggerRect.left - MENU_GAP : triggerRect.right + MENU_GAP
  const preferredLeft = opensLeft ? leftSide : anchorX
  const left = Math.max(VIEWPORT_PADDING, Math.min(preferredLeft, window.innerWidth - width - VIEWPORT_PADDING))

  const opensDown = triggerRect.top + height + VIEWPORT_PADDING <= window.innerHeight
  const top = opensDown ? triggerRect.top : Math.max(VIEWPORT_PADDING, triggerRect.bottom - height)

  const originX = anchorX - left
  const originY = opensDown ? 0 : triggerRect.bottom - top

  position.value = { top, left, origin: `${originX}px ${originY}px` }
}

async function openMenu(focusIndex = 0) {
  if (!isOpen.value) {
    isOpen.value = true
    await nextTick()
    updatePosition()
    addGlobalListeners()
  }
  focusItem(focusIndex)
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!isOpen.value) return
  isOpen.value = false
  removeGlobalListeners()
  if (restoreFocus) getTriggerElement()?.focus()
}

function toggleMenu() {
  if (isOpen.value) {
    closeMenu()
  } else {
    void openMenu()
  }
}

function selectItem(item: ActionMenuItem) {
  closeMenu({ restoreFocus: true })
  emit('select', item.value)
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    void openMenu(0)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    void openMenu(-1)
  }
}

function handleMenuKeydown(event: KeyboardEvent) {
  const current = itemElements.indexOf(document.activeElement as HTMLButtonElement)

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      focusItem(current + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusItem(current - 1)
      break
    case 'Home':
      event.preventDefault()
      focusItem(0)
      break
    case 'End':
      event.preventDefault()
      focusItem(-1)
      break
    case 'Escape':
      event.preventDefault()
      // Не даём Escape закрыть модалку, внутри которой может быть меню.
      event.stopPropagation()
      closeMenu({ restoreFocus: true })
      break
    case 'Tab':
      // Меню лежит в конце body: возвращаем фокус на кнопку,
      // и браузер переводит его к следующему элементу после неё.
      closeMenu({ restoreFocus: true })
      break
  }
}

function handleOutsidePointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (menuRef.value?.contains(target) || getTriggerElement()?.contains(target)) return
  closeMenu()
}

// При прокрутке или изменении размера окна меню отрывается от кнопки — проще закрыть.
function handleViewportChange() {
  closeMenu()
}

function addGlobalListeners() {
  document.addEventListener('pointerdown', handleOutsidePointerDown, true)
  window.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)
}

function removeGlobalListeners() {
  document.removeEventListener('pointerdown', handleOutsidePointerDown, true)
  window.removeEventListener('scroll', handleViewportChange, true)
  window.removeEventListener('resize', handleViewportChange)
}

onBeforeUnmount(removeGlobalListeners)
</script>

<template>
  <div class="ActionMenu">
    <ButtonIcon
      ref="triggerRef"
      :ariaLabel="ariaLabel"
      :variant="triggerVariant"
      size="m"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? menuId : undefined"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      <IconMenu size="s" />
    </ButtonIcon>

    <Teleport to="body">
      <Transition name="action-menu">
        <div
          v-if="isOpen"
          :id="menuId"
          ref="menuRef"
          class="ActionMenu-Menu"
          role="menu"
          :aria-label="ariaLabel"
          :style="{ top: `${position.top}px`, left: `${position.left}px`, transformOrigin: position.origin }"
          @keydown="handleMenuKeydown"
        >
          <button
            v-for="(item, index) in items"
            :key="item.value"
            :ref="(element) => setItemRef(element, index)"
            type="button"
            role="menuitem"
            tabindex="-1"
            class="ActionMenu-Item u-typo-body-small-s"
            :class="{ 'ActionMenu-Item_danger': item.danger }"
            @click="selectItem(item)"
          >
            <component :is="item.icon" v-if="item.icon" size="s" class="ActionMenu-Icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.ActionMenu {
  display: inline-flex;

  &-Menu {
    position: fixed;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 2px;
    border: 1px solid #d5dfe2;
    padding: 4px;
    border-radius: 16px;
    background: var(--color-background-surface);
    box-shadow: 0 6px 16px 0 #00000033;
    color: var(--color-text-default);
  }

  &-Item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    padding: 12px 8px 12px 12px;
    border: none;
    border-radius: 24px;
    background: inherit;
    color: inherit;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition: all var(--transition);

    &:hover,
    &:focus-visible {
      background: var(--neutral-100);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px #f5c96a99;
    }

    &_danger {
      color: var(--color-text-danger);
    }
  }

  &-Icon {
    flex-shrink: 0;
  }
}

// Появление: меню «вырастает» из угла кнопки (transform-origin задаётся в стиле элемента).
// Длительности — токены модальных окон; при prefers-reduced-motion они равны 0.
.action-menu-enter-active {
  transition:
    opacity var(--transition-duration-modal-enter) var(--transition-easing-modal),
    transform var(--transition-duration-modal-enter) var(--transition-easing-modal);
}

.action-menu-leave-active {
  transition:
    opacity var(--transition-duration-modal-leave) var(--transition-easing-modal),
    transform var(--transition-duration-modal-leave) var(--transition-easing-modal);
}

.action-menu-enter-from,
.action-menu-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
