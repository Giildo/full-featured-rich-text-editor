import { ref } from '@/utils/ref.ts'

type SpanType = 'bold' | 'italic' | 'lang'

export const contextContainer = ref<HTMLDivElement>()
export const contextContainerBackdrop = ref<HTMLDivElement>()
export const contextMenuDialog = ref<HTMLDialogElement>()
export const contextMenuDialogList = ref<HTMLUListElement>()

export const textSelection = ref<Selection | null>(null)
export const hasTextSelection = ref(false)

const closeContextMenu = () => {
  contextMenuDialog.value!.close()

  contextContainerBackdrop.value!.remove()

  hasTextSelection.value = false
  textSelection.value = null
}

export const openContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  if (contextMenuDialog.value) {
    if (window.getSelection()?.toString()) {
      hasTextSelection.value = true
      textSelection.value = window.getSelection()
    }

    const { x, y } = contextContainer.value!.getBoundingClientRect()
    contextMenuDialog.value.style.top = `${e.clientY - y}px`
    contextMenuDialog.value.style.left = `${e.clientX - x}px`

    contextContainerBackdrop.value = document.createElement('div')
    contextContainerBackdrop.value.classList.add('custom-backdrop')
    contextMenuDialog.value.insertAdjacentElement('afterend', contextContainerBackdrop.value)

    contextMenuDialog.value.show()

    const onClose = (event: MouseEvent) => {
      if (event.target === contextMenuDialog.value) {
        closeContextMenu()

        document.removeEventListener('click', onClose)
      }
    }

    document.addEventListener('click', onClose)
  }
}

export const initRightClick = () => {
  contextContainer.value?.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault()
    openContextMenu(e)
  })
}

export const contextSurroundBySpan = (type: SpanType): void => {
  const selection = textSelection.value
  if (selection) {
    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    // Surround the selected text with a span element
    const span = document.createElement('span')
    if (type === 'bold' || type === 'italic') {
      span.classList.add(`ffrte-${type}`)
    } else if (type === 'lang') {
      span.lang = 'en'
    }
    span.textContent = selectedText
    range.deleteContents() // Remove the selected text
    range.insertNode(span) // Insert the new span element
    // Move the cursor after the inserted span
    const newRange = document.createRange()
    newRange.setStartAfter(span)
    newRange.collapse(true)
    selection.removeAllRanges() // Clear the current selection
    selection.addRange(newRange) // Set the new range
    closeContextMenu()
  }
}

export const contextBold = () => {
  contextSurroundBySpan('bold')
}

export const contextItalic = () => {
  contextSurroundBySpan('italic')
}

export const contextLang = () => {
  contextSurroundBySpan('lang')
}
