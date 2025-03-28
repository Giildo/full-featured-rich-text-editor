import type { DialogType } from '@/type'
import { ref } from '@/utils/ref.ts'
import { codeToHtml } from 'shiki'
import { addTagInformationBlock, addTagList, addTagSimple } from '@/composables/useAddMethods.ts'

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
 * Method to remove an element from the DOM.
 * This method is used when the user presses the backspace key on an empty element or the delete key.
 * It removes the element from the DOM and focuses on the previous or next element.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {HTMLElement} item - The element to remove.
 *
 * @return {void}
 */
export const removeItem = (e: KeyboardEvent, item: HTMLElement): void => {
  e.preventDefault()
  const getItemFocus = (item: HTMLElement): HTMLElement | null => {
    const previousNext = (item.previousElementSibling ?? item.nextElementSibling) as HTMLElement | null
    if (!previousNext) return null

    if (previousNext.dataset.deletable === 'true') {
      return previousNext.children[0] as HTMLElement
    }

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
 * Method to navigate to the previous or next element.
 * This method is used when the user presses the arrow keys to navigate between elements.
 *
 * @param {string} direction - The direction to navigate. Can be 'previous' or 'next'.
 * @param {HTMLElement} item - The current element.
 *
 * @return {void}
 */
export const toPreviousNextElement = (direction: 'previous' | 'next', item: HTMLElement): void => {
  let sibling: HTMLElement | null = item[`${direction}ElementSibling`] as HTMLElement

  if (
    ['UL', 'OL'].includes(sibling?.tagName) ||
    (sibling?.tagName === 'DIV' && sibling.classList.contains('info-block'))
  ) {
    sibling = (direction === 'previous' ? sibling.lastElementChild : sibling.firstElementChild) as HTMLElement | null
  }

  if (sibling?.tagName === 'LABEL' && sibling.dataset.infoBlock === 'true') {
    sibling = sibling[`${direction}ElementSibling`] as HTMLElement | null
  }

  if (sibling) {
    Promise.resolve().then(() => {
      focusToEnd(sibling!)
    })
    return
  }

  const parent = item.parentElement as HTMLElement | null
  if (parent?.dataset?.name === 'editor-container') return

  sibling = parent?.[`${direction}ElementSibling`] as HTMLElement | null
  if (sibling) {
    Promise.resolve().then(() => {
      focusToEnd(sibling!)
    })
    return
  }
}

/**
 * Method to handle the keydown event on an element.
 * This method is used to:
 * - Arrow up/down: navigate to the previous/next element.
 * - Backspace/Delete: remove the current element. With the backspace key, if the element is empty, it will remove the previous element.
 * - Enter: call the callback function.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {HTMLElement} item - The current element.
 * @param {() => void} callback - The callback function to call when the enter key is pressed. Example: add a new paragraph after another one, or add a new list item after another one.
 * @param {() => void} removeCallback - The callback function to call when the remove key is pressed. Example: remove the list item and add a new paragraph after the list item if the list item is empty.
 *
 * @return {void}
 */
export const onItemKeydown = (
  e: KeyboardEvent,
  item: HTMLElement,
  callback: () => void,
  removeCallback: () => void = () => {},
): void => {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    toPreviousNextElement('previous', item)
    const prevItem = item.previousElementSibling as HTMLElement
    if (prevItem) {
      Promise.resolve().then(() => {
        focusToEnd(prevItem)
      })
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    toPreviousNextElement('next', item)
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

/**
 * Method to insert code into the content container.
 * This method is used when the user clicks on the add button in the dialog.
 * It creates a new code element with the specified language and content and adds it to the content container.
 *
 * @param {HTMLSelectElement} languageSelect - The select element containing the language options.
 * @param {HTMLPreElement} contentEditor - The pre element containing the code content.
 *
 * @return {Promise<void>}
 */
export const insertCode = async (languageSelect: HTMLSelectElement, contentEditor: HTMLPreElement): Promise<void> => {
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
