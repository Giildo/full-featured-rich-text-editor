import { ListDialogType, SimpleDialogType, VisualBlockDialogType } from '@/type'
import { addTagDialog, contentContainer, focusToEnd, onItemKeydown } from '@/composables/useDialogs.ts'
import { addTagButtons } from '@/composables/useItems.ts'

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
