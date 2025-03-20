import type { ActionButton } from '@/vite-env'

import actionsStyle from '@/assets/style/actions.css?inline'

import '@/components/dialogs/EditorAddTagDialog.ts'
import { Ref, ref, watch } from '@/utils/ref.ts'

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

  private _addTagDialog: HTMLElement | null = null
  private _addTagDialogOpen: Ref<boolean> = ref<boolean>(false)

  private _codeDialog: HTMLElement | null = null
  private _codeDialogOpen: Ref<boolean> = ref<boolean>(false)

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
      
      <editor-add-tag-dialog open="${this._addTagDialogOpen.value}"></editor-add-tag-dialog>
      <editor-code-dialog open="${this._codeDialogOpen.value}"></editor-code-dialog>
    `

    this._shadowRoot.querySelectorAll<HTMLButtonElement>('button').forEach((button, index) => {
      button.addEventListener('click', this._buttons[index].onClick)
    })

    this._addTagDialog = this._shadowRoot.querySelector<HTMLElement>('editor-add-tag-dialog')
    this._addTagDialogOpen = watch(this._addTagDialogOpen, () => {
      this._addTagDialog?.setAttribute('open', `${this._addTagDialogOpen.value}`)
      this.dispatchEvent(new CustomEvent('add-tag-dialog-open', { detail: this._addTagDialogOpen.value }))
    })
    this._addTagDialog?.addEventListener('close', () => {
      this._addTagDialogOpen.value = false
    })
    this._addTagDialog?.addEventListener('add-tag', (e) => {
      this.dispatchEvent(new CustomEvent('add-tag', { detail: (e as CustomEvent).detail }))
    })

    this._codeDialog = this._shadowRoot.querySelector<HTMLElement>('editor-code-dialog')
    this._codeDialogOpen = watch(this._codeDialogOpen, () => {
      this._codeDialog?.setAttribute('open', `${this._codeDialogOpen.value}`)
      this.dispatchEvent(new CustomEvent('code-dialog-open', { detail: this._codeDialogOpen.value }))
    })
  }

  static get observedAttributes() {
    return ['code-dialog-open', 'add-tag-dialog-open']
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'code-dialog-open') this._codeDialogOpen.value = newValue === 'true'
    if (name === 'add-tag-dialog-open') this._addTagDialogOpen.value = newValue === 'true'
  }

  private _onOpenAddTagDialog() {
    this._addTagDialogOpen.value = true
  }

  private _toggleTags(e: PointerEvent) {
    console.log(e)
  }

  private _clearContent(e: PointerEvent) {
    console.log(e)
  }
}

customElements.define('editor-actions', EditorActions)
