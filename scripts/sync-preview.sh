#!/usr/bin/env bash
# Подготовка превью: сборка (приложение + Storybook) → копирование в репозиторий превью.
# Коммит и пуш скрипт НЕ делает — они выполняются вручную (например, из WebStorm).
#
# Использование:
#   npm run sync:preview                  # собрать и скопировать
#   npm run sync:preview -- --no-build    # скопировать уже собранную папку build-preview/
#
# Путь к репозиторию превью можно переопределить: PREVIEW_DIR=/path/to/repo npm run sync:preview
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
BUILD_DIR="$ROOT/build-preview"
PREVIEW_DIR="${PREVIEW_DIR:-$(cd "$ROOT/.." && pwd)/turnover-ledger-preview}"

# Файлы и папки репозитория превью, которых нет в сборке и которые нельзя удалять при синхронизации.
KEEP=(.git .nojekyll .idea .junie)

BUILD=1

for arg in "$@"; do
  case "$arg" in
    --no-build) BUILD=0 ;;
    *)
      echo "Неизвестный аргумент: $arg" >&2
      exit 1
      ;;
  esac
done

fail() {
  echo "✖ $1" >&2
  exit 1
}

# --- Проверки до сборки, чтобы не ждать её впустую ---------------------------------------------

command -v rsync >/dev/null || fail "Не найден rsync (sudo apt install rsync)."
git -C "$PREVIEW_DIR" rev-parse --git-dir >/dev/null 2>&1 || fail "Не найден git-репозиторий превью: $PREVIEW_DIR"

# Защита основного репозитория: rsync --delete удаляет в PREVIEW_DIR всё, чего нет в сборке,
# поэтому убеждаемся, что это именно отдельный репозиторий превью, а не основной и не папка внутри него.
PREVIEW_TOP="$(git -C "$PREVIEW_DIR" rev-parse --show-toplevel)"
[ "$PREVIEW_TOP" != "$ROOT" ] || fail "PREVIEW_DIR указывает на основной репозиторий ($ROOT) — остановлено."
[ "$(cd "$PREVIEW_DIR" && pwd -P)" = "$(cd "$PREVIEW_TOP" && pwd -P)" ] ||
  fail "PREVIEW_DIR должен быть корнем репозитория превью, а не папкой внутри другого репозитория: $PREVIEW_DIR"

PREVIEW_REMOTE="$(git -C "$PREVIEW_DIR" remote get-url origin 2>/dev/null || true)"
case "$PREVIEW_REMOTE" in
  *turnover-ledger-preview*) ;;
  *) fail "origin репозитория превью не похож на turnover-ledger-preview: ${PREVIEW_REMOTE:-не задан} — остановлено." ;;
esac

# --- Сборка --------------------------------------------------------------------------------------

if [ "$BUILD" -eq 1 ]; then
  echo "→ Собираю превью…"
  (cd "$ROOT" && npm run build:preview)
fi

[ -f "$BUILD_DIR/index.html" ] || fail "Нет собранного превью: $BUILD_DIR/index.html"

# --- Копирование -----------------------------------------------------------------------------------
# --delete убирает файлы, которых больше нет в сборке (старые assets с хешами в именах).

echo "→ Копирую $BUILD_DIR → $PREVIEW_DIR"
EXCLUDES=()
for item in "${KEEP[@]}"; do
  EXCLUDES+=(--exclude "/$item")
done
rsync -a --delete "${EXCLUDES[@]}" "$BUILD_DIR/" "$PREVIEW_DIR/"
touch "$PREVIEW_DIR/.nojekyll"

# --- Итог (только чтение git, ничего не коммитится) ------------------------------------------------

CHANGES="$(git -C "$PREVIEW_DIR" status --porcelain --untracked-files=all)"

if [ -z "$CHANGES" ]; then
  echo "✔ Изменений нет — превью уже актуально."
  exit 0
fi

ADDED="$(grep -c '^??' <<<"$CHANGES" || true)"
DELETED="$(grep -c '^ D' <<<"$CHANGES" || true)"
MODIFIED="$(grep -c '^ M' <<<"$CHANGES" || true)"

echo "✔ Файлы скопированы: новых $ADDED, изменённых $MODIFIED, удалённых $DELETED."
echo "  Осталось закоммитить и запушить репозиторий превью: $PREVIEW_DIR"
