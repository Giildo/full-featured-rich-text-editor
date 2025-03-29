import { codeDialog, contentContainer, focusToEnd } from '@/composables/useDialogs.ts'
import { testIfSiblingIsAnInformationBlock, testIfSiblingIsBlock } from '@/composables/moveMethods.ts'

/**
 * Method to remove an element from the DOM.
 * This method is used when the user presses the backspace key on an empty element or the delete key.
 * It removes the element from the DOM and focuses on the previous or next element.
 *
 * @param {HTMLElement} item - The element to remove.
 *
 * @return {void}
 */
export const removeItem = (item: HTMLElement): void => {
  const getItemFocus = (item: HTMLElement): HTMLElement | null => {
    let previousNext = (item.nextElementSibling ?? item.previousElementSibling) as HTMLElement | null
    previousNext = testIfSiblingIsBlock('next', previousNext)
    previousNext = testIfSiblingIsAnInformationBlock('next', previousNext)
    return previousNext
  }

  let itemToFocus = getItemFocus(item)

  const parent = item.parentElement as HTMLElement | null

  item.remove()

  if (parent && parent.dataset.deletable === 'true') {
    if (parent.classList.contains('info-block') && parent.children.length <= 1) {
      itemToFocus = getItemFocus(parent)
      parent.remove()
    } else if (parent.classList.contains('list-block') && parent.children.length <= 0) {
      itemToFocus = getItemFocus(parent)
      parent.remove()
    }
  }

  if (itemToFocus) {
    Promise.resolve().then(() => {
      focusToEnd(itemToFocus)
    })
  }
}
/**
 * Method to remove the code block from the content container.
 * This method is used when the user clicks on the remove button in the code dialog.
 *
 * @return {void}
 */
export const removeCode = (): void => {
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
