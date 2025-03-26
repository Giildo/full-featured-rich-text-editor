import type { DialogType, ListDialogType, SimpleDialogType } from '@/type'
import { ref } from '@/utils/ref.ts'
import { codeToHtml } from 'shiki'

export const addTagDialog = ref<HTMLDialogElement>()
export const codeDialog = ref<HTMLDialogElement>()

export const contentContainer = ref<HTMLDivElement>()
const focusToEnd = (element: HTMLElement) => {
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(element)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}
const removeItem = (e: KeyboardEvent, item: HTMLElement) => {
  e.preventDefault()
  const prevItem = item.previousElementSibling as HTMLElement
  item.remove()
  if (prevItem) {
    Promise.resolve().then(() => {
      focusToEnd(prevItem)
    })
  }
}

const onItemKeydown = (
  e: KeyboardEvent,
  item: HTMLElement,
  callback: () => void,
  removeCallback: () => void = () => {},
) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prevItem = item.previousElementSibling as HTMLElement
    if (prevItem) {
      Promise.resolve().then(() => {
        focusToEnd(prevItem)
      })
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const nextItem = item.nextElementSibling as HTMLElement
    if (nextItem) {
      Promise.resolve().then(() => {
        focusToEnd(nextItem)
      })
    }
  } else if ((e.key === 'Backspace' && item.innerText === '') || e.key === 'Delete') {
    let itemFocus = item.nextElementSibling as HTMLElement
    if (!itemFocus) {
      itemFocus = item.previousElementSibling as HTMLElement
    }
    removeItem(e, item)
    if (itemFocus) {
      Promise.resolve().then(() => {
        focusToEnd(itemFocus)
      })
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (item.innerText === '') {
      removeItem(e, item)
      removeCallback()
      return
    }
    callback()
  }
}

const addTagSimple = (type: SimpleDialogType, afterThis?: HTMLElement) => {
  const item = document.createElement(type)
  item.contentEditable = 'true'
  item.addEventListener('keydown', (e) => onItemKeydown(e, item, () => addTagSimple('p', item)))
  item.addEventListener('focus', () => focusToEnd(item))
  if (afterThis) {
    afterThis.after(item)
  } else {
    contentContainer.value?.appendChild(item)
  }
  addTagDialog.value?.close()
  Promise.resolve().then(() => {
    focusToEnd(item)
  })
}
const addTagList = (type: ListDialogType, parentNode?: HTMLElement) => {
  const item = parentNode ?? document.createElement(type)

  const li = document.createElement('li')
  li.contentEditable = 'true'
  li.addEventListener('keydown', (e) => {
    onItemKeydown(
      e,
      li,
      () => {
        addTagList(type, item)
      },
      () => {
        addTagSimple('p', item)
      },
    )
  })
  li.addEventListener('focus', () => focusToEnd(li))

  item.appendChild(li)
  if (!parentNode) contentContainer.value?.appendChild(item)
  addTagDialog.value?.close()
  Promise.resolve().then(() => {
    focusToEnd(li)
  })
}

export const addTag = (type: DialogType) => {
  switch (type) {
    case 'p':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      addTagSimple(type)
      break
    case 'code':
      codeDialog.value?.showModal()
      break
    case 'ul':
    case 'ol':
      addTagList(type)
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
