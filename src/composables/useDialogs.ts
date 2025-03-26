import { ref } from '@/utils/ref.ts'
import type { DialogType } from '@/vite-env'
import { codeToHtml } from 'shiki'

export const addTagDialog = ref<HTMLDialogElement>()
export const codeDialog = ref<HTMLDialogElement>()

export const contentContainer = ref<HTMLDivElement>()
export const addTag = (type: DialogType) => {
  let item: HTMLElement | null = null
  switch (type) {
    case 'p':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      item = document.createElement(type)
      item.contentEditable = 'true'
      contentContainer.value?.appendChild(item)
      addTagDialog.value?.close()
      Promise.resolve().then(() => {
        item!.focus()
      })
      break
    case 'code':
      codeDialog.value?.showModal()
      break
  }
}

export const insertCode = async (languageSelect: HTMLSelectElement, contentEditor: HTMLPreElement) => {
  const oldItem =
    contentContainer.value?.querySelector<HTMLPreElement>(
      `[data-id="${sessionStorage.getItem('item-update') || ''}"]`,
    ) || null
  if (oldItem) {
    oldItem.removeAttribute('data-id')
    sessionStorage.removeItem('item-update')
  }
  let item: HTMLElement | null = document.createElement('div')
  const langage = languageSelect.value || 'css'
  const content = contentEditor.innerText || ''
  item.innerHTML = await codeToHtml(content || '', {
    lang: langage,
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
  })
  item = item.querySelector<HTMLElement>('pre')
  if (!item) return

  item.addEventListener('click', () => {
    languageSelect.value = langage
    contentEditor.innerText = content
    item!.dataset.id = self.crypto.randomUUID()
    sessionStorage.setItem('item-update', item!.dataset.id)
    codeDialog.value?.showModal()
  })

  if (oldItem) {
    oldItem.replaceWith(item)
  } else {
    contentContainer.value?.appendChild(item)
    addTagDialog.value?.close()
  }

  codeDialog.value?.close()
}

export const removeCode = () => {
  const oldItem =
    contentContainer.value?.querySelector<HTMLPreElement>(
      `[data-id="${sessionStorage.getItem('item-update') || ''}"]`,
    ) || null
  if (oldItem) {
    oldItem.remove()
    sessionStorage.removeItem('item-update')
    codeDialog.value?.close()
  }
}
