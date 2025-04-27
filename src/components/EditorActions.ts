import '@/assets/style/actions.css'

import type { ActionButton, CodeDialogOptions } from '@/type'

import { addTagDialog } from '@/composables/useDialogs.ts'
import { EditorAddTagDialog } from '@/components/dialogs/EditorAddTagDialog.ts'
import { EditorCodeDialog } from '@/components/dialogs/EditorCodeDialog.ts'
import { EditorTableDialog } from '@/components/dialogs/EditorTableDialog.ts'

export class EditorActions {
  private _buttons: ActionButton[] = [
    {
      title: 'Ajouter une balise dans le contenu',
      icon: 'M19,11H15V15H13V11H9V9H13V5H15V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z',
      onClick: () => this._onOpenAddTagDialog(),
    },
    {
      title: 'Afficher/cacher les balises',
      icon: 'M10,11A4,4 0 0,1 6,7A4,4 0 0,1 10,3H18V5H16V21H14V5H12V21H10V11Z',
      onClick: (e) => this._toggleTags(e as PointerEvent),
    },
    {
      title: 'Vider le contenu',
      icon: 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z',
      onClick: (e) => this._clearContent(e as PointerEvent),
    },
  ]

  constructor(fullRichTextEditor: HTMLDivElement, { languages }: CodeDialogOptions) {
    const menuContainer = document.createElement('menu')

    this._buttons.forEach((button) => {
      const li = document.createElement('li')

      const buttonElement = document.createElement('button')
      buttonElement.title = button.title
      buttonElement.addEventListener('click', button.onClick)

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svg.setAttribute('viewBox', '0 0 24 24')

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', button.icon)

      svg.appendChild(path)
      buttonElement.appendChild(svg)
      li.appendChild(buttonElement)
      menuContainer.appendChild(li)
    })

    fullRichTextEditor.insertAdjacentElement('afterbegin', menuContainer)

    new EditorAddTagDialog(fullRichTextEditor)
    new EditorCodeDialog(fullRichTextEditor, { languages })
    new EditorTableDialog(fullRichTextEditor)
  }

  private _onOpenAddTagDialog() {
    addTagDialog.value?.showModal()
  }

  private _toggleTags(e: PointerEvent) {
    console.log(e)
  }

  private _clearContent(e: PointerEvent) {
    console.log(e)
  }
}
