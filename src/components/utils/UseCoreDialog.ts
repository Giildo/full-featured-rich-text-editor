import '@/components/utils/CoreDialog'

interface EditorAddTagDialogOptions {
  content: string
  dialogStyle: string
  title: string
}

export class UseCoreDialog extends HTMLElement {
  protected _open: boolean = false

  protected readonly _coreDialog: HTMLElement

  protected _shadowRoot: ShadowRoot

  constructor({ content, dialogStyle, title }: EditorAddTagDialogOptions) {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })

    this._shadowRoot.innerHTML = `
      <style>
        ${dialogStyle}
      </style>
      <core-dialog open="${this._open}">
        <h3 slot="title">${title}</h3>
        
        ${content}
      </core-dialog>
    `

    this._coreDialog = this._shadowRoot.querySelector('core-dialog')!
    this._coreDialog.addEventListener('close', () => this.dispatchEvent(new CustomEvent('close')))
  }

  static get observedAttributes() {
    return ['open']
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'open') {
      const dialog = this._shadowRoot.querySelector('core-dialog')
      if (dialog) {
        if (newValue === 'true') {
          dialog.setAttribute('open', 'true')
        } else {
          dialog.setAttribute('open', 'false')
        }
      }
    }
  }
}
