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
      console.log(addTagDialog.value)
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

export const insertCode = async (language: string, content: string) => {
  let item: HTMLElement | null = document.createElement('div')
  item.innerHTML = await codeToHtml(content, {
    lang: language,
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
  })
  item = item.querySelector<HTMLElement>('pre')
  if (!item) return
  item.addEventListener('click', () => {
    console.log('Open code editor')
  })
  contentContainer.value?.appendChild(item)
  addTagDialog.value?.close()
  codeDialog.value?.close()
}
