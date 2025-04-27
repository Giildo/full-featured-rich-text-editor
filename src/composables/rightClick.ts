import { ref } from '@/utils/ref.ts'

export const contextMenu = ref<HTMLElement>()

export const textSelection = ref<Selection | null>(null)
export const hasTextSelection = ref(false)

export const openContextMenu = (e: MouseEvent, editor: HTMLDivElement) => {
  e.preventDefault()
  if (contextMenu.value) {
    if (window.getSelection()?.toString()) {
      hasTextSelection.value = true
      textSelection.value = window.getSelection()
    }

    const { x, y } = editor.getBoundingClientRect()
    contextMenu.value.style.top = `${e.clientY - y}px`
    contextMenu.value.style.left = `${e.clientX - x}px`
    contextMenu.value.classList.add('active')

    const closeContextMenu = (e: MouseEvent) => {
      if (!contextMenu.value!.contains(e.target as Node)) {
        contextMenu.value!.classList.remove('active')

        hasTextSelection.value = false
        textSelection.value = null

        document.removeEventListener('click', closeContextMenu)
      }
    }

    document.addEventListener('click', closeContextMenu)
  }
}

export const initRightClick = (editor: HTMLDivElement) => {
  editor.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault()
    openContextMenu(e, editor)
  })
}
