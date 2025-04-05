import { tableMove, toPreviousNextElement } from '@/composables/moveMethods.ts'
import { removeItem } from '@/composables/removeMethods.ts'

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
  if (e.altKey && e.key === 'ArrowUp') {
    e.preventDefault()
    toPreviousNextElement('previous', item)
  } else if (e.altKey && e.key === 'ArrowDown') {
    e.preventDefault()
    toPreviousNextElement('next', item)
  } else if ((e.key === 'Backspace' && (item.innerText === '' || item.innerText === '\n')) || e.key === 'Delete') {
    e.preventDefault()
    removeItem(item)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (item.innerText === '' || item.innerText === '\n') {
      removeItem(item)
      removeCallback()
      return
    }
    callback()
  }
}

/**
 * Method to handle the keydown event on a table cell.
 * This method is used to:
 * - Alt + arrow up/down/left/right: navigate to the previous/next cell.
 * - Alt + delete/backspace: remove the content of the cell.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {HTMLTableCellElement} item - The current table cell element.
 * @param {HTMLTableElement} table - The table element.
 *
 * @return {void}
 */
export const onTableKeydown = (e: KeyboardEvent, item: HTMLTableCellElement, table: HTMLTableElement): void => {
  const key = e.key.toLowerCase().replace('arrow', '')
  // alt + arrow
  if (e.altKey && (key === 'up' || key === 'down' || key === 'left' || key === 'right')) {
    e.preventDefault()
    tableMove(key, item, table)
  } else if (e.altKey && e.shiftKey && (key === 'delete' || key === 'backspace')) {
    e.preventDefault()

    // item.parentNode!.remove()
  } else if (e.altKey && (key === 'delete' || key === 'backspace')) {
    e.preventDefault()
    item.innerText = ''
  }
}
