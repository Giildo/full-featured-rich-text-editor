import { ListDialogType, SimpleDialogType, VisualBlockDialogType } from '@/type'
import { addTagDialog, codeDialog, contentContainer, focusToEnd, tableDialog } from '@/composables/useDialogs.ts'
import { addTagButtons } from '@/composables/useItems.ts'
import { onItemKeydown, onTableKeydown } from '@/composables/keyboardEvents.ts'
import { codeToHtml } from 'shiki'

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
export const addCodeBlock = async (languageSelect: HTMLSelectElement, contentEditor: HTMLPreElement): Promise<void> => {
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
 * Method to add a new tag with visual block information to the content container.
 * This method is used when the user clicks on the add button in the dialog.
 * It creates a new element with the specified type and adds it to the content container.
 *
 * @param {VisualBlockDialogType} type - The type of the visual block element to create. Can be 'info' or 'warning'.
 * @param {HTMLParagraphElement} afterThis - The element after which to insert the new element. If not specified, it will be added at the end of the content container.
 * @param {HTMLDivElement} parentNode - The parent node to which to append the new visual block item. If not specified, it will be added at the end of the content container.
 *
 * @return {void}
 */
export const addTagInformationBlock = (
  type: VisualBlockDialogType,
  afterThis?: HTMLParagraphElement,
  parentNode?: HTMLDivElement,
): void => {
  const parentContainer = parentNode ?? document.createElement('div')
  if (!parentNode) {
    const id = self.crypto.randomUUID()
    const label = document.createElement('label')
    label.dataset.infoBlock = 'true'
    label.setAttribute('id', id)

    parentContainer.classList.add('info-block', type)
    parentContainer.dataset.deletable = 'true'
    parentContainer.setAttribute('aria-labelledby', id)
    parentContainer.insertAdjacentElement('afterbegin', label)

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    icon.setAttribute('viewBox', '0 0 24 24')
    icon.setAttribute('fill', `var(--${type}-color)`)
    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const buttonsGroup = addTagButtons.find((group) => group.title === "Blocs d'information")
    iconPath.setAttribute('d', buttonsGroup?.buttons.find((btn) => btn.type === type)?.icon || '')
    icon.appendChild(iconPath)
    label.appendChild(icon)

    switch (type) {
      case 'alert':
        label.append('Attention')
        parentContainer.role = 'alert'
        break
      case 'info':
        label.append('Information')
        parentContainer.role = 'note'
        break
      case 'success':
        label.append('Succès')
        parentContainer.role = 'note'
        break
      case 'warning':
        label.append('Attention')
        parentContainer.role = 'alert'
        break
    }
  }

  const text = document.createElement('p')
  text.contentEditable = 'true'
  text.addEventListener('keydown', (e) => {
    onItemKeydown(
      e,
      text,
      () => {
        addTagInformationBlock(type, text, parentContainer)
      },
      () => {
        addTagSimple('p', parentContainer)
      },
    )
  })
  text.addEventListener('focus', () => focusToEnd(text))

  if (afterThis) {
    afterThis.after(text)
  } else {
    parentContainer.appendChild(text)
  }

  if (!parentNode) contentContainer.value?.appendChild(parentContainer)
  addTagDialog.value?.close()
  Promise.resolve().then(() => {
    focusToEnd(text)
  })
}

/**
 * Method to add a new list item to the content container.
 * This method is used when the user clicks on the add button in the dialog.
 * It creates a new list element with the specified type and adds it to the content container.
 *
 * @param {ListDialogType} type - The type of the list element to create. Can be 'ul' or 'ol'.
 * @param {HTMLElement} parentNode - The parent node to which to append the new list item. If not specified, it will be added at the end of the content container.
 *
 * @return {void}
 */
export const addTagList = (type: ListDialogType, parentNode?: HTMLElement): void => {
  const parentContainer = parentNode ?? document.createElement(type)
  if (!parentNode) {
    parentContainer.classList.add('list-block')
    parentContainer.dataset.deletable = 'true'
  }

  const li = document.createElement('li')
  li.contentEditable = 'true'
  li.addEventListener('keydown', (e) => {
    onItemKeydown(
      e,
      li,
      () => {
        addTagList(type, parentContainer)
      },
      () => {
        addTagSimple('p', parentContainer)
      },
    )
  })
  li.addEventListener('focus', () => focusToEnd(li))

  parentContainer.appendChild(li)
  if (!parentNode) contentContainer.value?.appendChild(parentContainer)
  addTagDialog.value?.close()
  Promise.resolve().then(() => {
    focusToEnd(li)
  })
}

/**
 * Method to add a new tag to the content container.
 * This method is used when the user clicks on the add button in the dialog.
 * It creates a new element with the specified type and adds it to the content container.
 *
 * @param {DialogType} type - The type of the element to create. Can be 'p', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'ul', or 'ol'.
 * @param {HTMLElement} afterThis - The element after which to insert the new element. If not specified, it will be added at the end of the content container.
 *
 * @return {void}
 */
export const addTagSimple = (type: SimpleDialogType, afterThis?: HTMLElement): void => {
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

/**
 * Method to add a new table to the content container.
 * This method is used when the user clicks on the add button in the dialog.
 * It creates a new table element with the specified number of rows and columns and adds it to the content container.
 *
 * @param {number} x - The number of columns in the table.
 * @param {number} y - The number of rows in the table.
 * @param {boolean} firstLineIsHeader - Whether the first line of the table is a header or not.
 *
 * @return {void}
 */
export const addTagTable = (x: number, y: number, firstLineIsHeader: boolean): void => {
  const table = document.createElement('table')
  let firstCell: HTMLTableCellElement | null = null

  if (firstLineIsHeader) {
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')
    for (let j = 0; j < x; j++) {
      const th = document.createElement('th')
      th.contentEditable = 'true'
      th.scope = 'col'
      th.dataset.x = j.toString()
      th.dataset.y = '0'

      if (j === 0) {
        firstCell = th
      }

      th.addEventListener('keydown', (e) => onTableKeydown(e, th, table))
      // th.addEventListener('focus', () => focusToEnd(th))
      tr.appendChild(th)
    }
    thead.appendChild(tr)
    table.prepend(thead)
  }

  const tbody = document.createElement('tbody')
  for (let i = 0; i < (firstLineIsHeader ? y - 1 : y); i++) {
    const tr = document.createElement('tr')
    for (let j = 0; j < x; j++) {
      const td = document.createElement('td')
      td.contentEditable = 'true'
      td.dataset.x = j.toString()
      td.dataset.y = (firstLineIsHeader ? i + 1 : i).toString()
      td.addEventListener('keydown', (e) => onTableKeydown(e, td, table))

      if (!firstLineIsHeader && i === 0 && j === 0) {
        firstCell = td
      }
      // td.addEventListener('focus', () => focusToEnd(td))
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)
  contentContainer.value?.appendChild(table)
  tableDialog.value?.close()
  addTagDialog.value?.close()
  if (firstCell) focusToEnd(firstCell)
}
