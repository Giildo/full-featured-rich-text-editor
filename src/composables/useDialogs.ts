import type { DialogType } from '@/type'
import { ref } from '@/utils/ref.ts'
import { addTagInformationBlock, addTagList, addTagSimple } from '@/composables/addMethods.ts'

export const addTagDialog = ref<HTMLDialogElement>()
export const codeDialog = ref<HTMLDialogElement>()

export const contentContainer = ref<HTMLDivElement>()

/**
 * Method to focus on the end of the element. Example: when you navigate to the next element with the arrow keys, the cursor is placed at the end of the element.
 *
 * @param {HTMLElement} element - The element to focus on.
 *
 * @return {void}
 */
export const focusToEnd = (element: HTMLElement): void => {
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(element)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

/**
 * Method to add a new tag to the content container.
 * This method is used when the user clicks on the add button in the dialog.
 * It creates a new element with the specified type and adds it to the content container.
 *
 * @param {DialogType} type - The type of the element to create. Can be 'p', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'ul', or 'ol'.
 *
 * @return {void}
 */
export const addTag = (type: DialogType): void => {
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
    case 'alert':
    case 'info':
    case 'success':
    case 'warning':
      addTagInformationBlock(type)
      break
  }
}
