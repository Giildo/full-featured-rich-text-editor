import type { ActionButton, EditorAddTagDialogInterface, EditorCodeDialogInterface } from '@/type'

import actionsStyle from '@/assets/style/actions.css?inline'

import '@/components/dialogs/EditorAddTagDialog.ts'
import '@/components/dialogs/EditorCodeDialog.ts'

import { addTagDialog, codeDialog } from '@/composables/useDialogs.ts'

class EditorActions extends HTMLElement {
  private _shadowRoot: ShadowRoot

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

  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })

    this._shadowRoot.innerHTML = `
      <style>
        :host {
          --button-nb: ${this._buttons.length};
        }
      
        ${actionsStyle}
      </style>
      <menu>
        ${this._buttons
          .map((button) => {
            return `
              <li>
                <button title="${button.title}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${button.icon}" /></svg>
                </button>
              </li>
            `
          })
          .join('')}
      </menu>
      
      <editor-add-tag-dialog></editor-add-tag-dialog>
      <editor-code-dialog></editor-code-dialog>
    `

    this._shadowRoot.querySelectorAll<HTMLButtonElement>('button').forEach((button, index) => {
      button.addEventListener('click', this._buttons[index].onClick)
    })

    addTagDialog.value = this._shadowRoot.querySelector<EditorAddTagDialogInterface>('editor-add-tag-dialog')!.dialog
    codeDialog.value = this._shadowRoot.querySelector<EditorCodeDialogInterface>('editor-code-dialog')!.dialog
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

customElements.define('editor-actions', EditorActions)
