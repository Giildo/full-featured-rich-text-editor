import type { Direction, Siblings } from '@/type'
import { focusToEnd } from '@/composables/useDialogs.ts'

/**
 * Method to test if the sibling is an info block.
 * This method is used to navigate between elements.
 * If the sibling is an info block, it will return the first or last child of the info block.
 *
 * @param {string} direction - The direction to navigate. Can be 'previous' or 'next'.
 * @param {HTMLElement} sibling - The sibling element to test.
 *
 * @return {HTMLElement | null}
 */
export const testIfSiblingIsBlock = (direction: Siblings, sibling: HTMLElement | null): HTMLElement | null => {
  if (
    (sibling?.tagName === 'DIV' && sibling.classList.contains('info-block')) ||
    sibling?.tagName === 'UL' ||
    sibling?.tagName === 'OL'
  ) {
    return sibling[direction === 'previous' ? 'lastElementChild' : 'firstElementChild'] as HTMLElement | null
  }

  return sibling
}

/**
 * Method to test if the sibling is an information block. Example: the label tag in the start of the info block.
 * This method is used to navigate between elements.
 * If the sibling is an information block, it will return the next or previous element.
 *
 * @param {string} direction - The direction to navigate. Can be 'previous' or 'next'.
 * @param {HTMLElement} sibling - The sibling element to test.
 *
 * @return {HTMLElement | null}
 */
export const testIfSiblingIsAnInformationBlock = (
  direction: Siblings,
  sibling: HTMLElement | null,
): HTMLElement | null => {
  return sibling?.tagName === 'LABEL' && sibling.dataset.infoBlock === 'true'
    ? (sibling[`${direction}ElementSibling`] as HTMLElement | null)
    : sibling
}

/**
 * Method to test if the sibling is a table.
 * This method is used to navigate between elements.
 * If the sibling is a table, it will return the first or last cell of the table.
 *
 * @param direction
 * @param sibling
 */
export const testIfSiblingIsATable = (direction: Siblings, sibling: HTMLElement | null): HTMLElement | null => {
  if (sibling?.tagName === 'TABLE') {
    return direction === 'next'
      ? (sibling.querySelector(':where(thead, tbody) tr:first-child :where(th, td):first-child') as HTMLElement | null)
      : (sibling.querySelector('tbody tr:last-child td:last-child') as HTMLElement | null)
  }

  return sibling
}

/**
 * Method to test if the parent is an editor container.
 * This method is used to navigate between elements.
 * If the parent is the editor container, it's on the top level or the bottom level, and we don't want to navigate to the previous or next element.
 * If the parent is not the editor container, we want to navigate to the parent previous or next element.
 *
 * @param {string} direction - The direction to navigate. Can be 'previous' or 'next'.
 * @param {HTMLElement} item - The current element.
 * @param {HTMLElement | null} sibling - The sibling element to test.
 *
 * @return {void}
 */
export const testParent = (direction: Siblings, item: HTMLElement, sibling: HTMLElement | null = null): void => {
  const parent = item.parentElement as HTMLElement | null
  if (parent?.dataset?.name === 'editor-container') return

  sibling = parent?.[`${direction}ElementSibling`] as HTMLElement | null

  sibling = testIfSiblingIsBlock(direction, sibling)
  sibling = testIfSiblingIsAnInformationBlock(direction, sibling)
  sibling = testIfSiblingIsATable(direction, sibling)

  if (sibling) {
    Promise.resolve().then(() => {
      focusToEnd(sibling!)
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
export const toPreviousNextElement = (direction: Siblings, item: HTMLElement): void => {
  let sibling: HTMLElement | null = item[`${direction}ElementSibling`] as HTMLElement

  sibling = testIfSiblingIsBlock(direction, sibling)
  sibling = testIfSiblingIsAnInformationBlock(direction, sibling)
  sibling = testIfSiblingIsATable(direction, sibling)

  if (sibling) {
    Promise.resolve().then(() => {
      focusToEnd(sibling!)
    })
    return
  }

  testParent(direction, item, sibling)
}

/**
 * Method to move the cursor to the next or previous cell in the table.
 * This method is used when the user presses the arrow keys to navigate between cells.
 *
 * @param direction
 * @param item
 * @param table
 */
export const tableMove = (direction: Direction, item: HTMLTableCellElement, table: HTMLTableElement) => {
  const x = parseInt(item.dataset.x!)
  const y = parseInt(item.dataset.y!)

  switch (direction) {
    case 'up':
      if (y > 0) {
        focusToEnd(table.querySelector(`[data-x="${x}"][data-y="${y - 1}"]`) as HTMLTableCellElement)
      } else {
        toPreviousNextElement('previous', table)
      }
      break
    case 'down':
      if (y < table.rows.length - 1) {
        focusToEnd(table.querySelector(`[data-x="${x}"][data-y="${y + 1}"]`) as HTMLTableCellElement)
      } else {
        toPreviousNextElement('next', table)
      }
      break
    case 'left':
      if (x > 0) {
        focusToEnd(table.querySelector(`[data-x="${x - 1}"][data-y="${y}"]`) as HTMLTableCellElement)
      }
      break
    case 'right':
      if (x < table.rows[0].cells.length - 1) {
        focusToEnd(table.querySelector(`[data-x="${x + 1}"][data-y="${y}"]`) as HTMLTableCellElement)
      }
      break
  }
}
