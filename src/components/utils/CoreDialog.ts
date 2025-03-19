import dialogStyle from '@/assets/style/dialog.css?inline'

class CoreDialog extends HTMLElement {
  private readonly _dialog: HTMLDialogElement
  private readonly _dialogContainer: HTMLDivElement
  private readonly _closeButton: HTMLButtonElement

  private _shadowRoot: ShadowRoot

  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })

    this._shadowRoot.innerHTML = `
      <style>
        ${dialogStyle}
      </style>
      <dialog>
        <div>
          <header>
            <slot name="title"></slot>
            <button title="Fermer la fenêtre">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="var(--text-color)" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
            </button>
          </header>
          
          <section>
            <slot></slot>
          </section>
        </div>
      </dialog>
    `

    this._dialog = this._shadowRoot.querySelector<HTMLDialogElement>('dialog')!
    this._closeButton = this._dialog.querySelector<HTMLButtonElement>('div > header > button')!
    this._closeButton.addEventListener('click', () => this._closeDialog({ isDirectClose: true }))

    this._dialogContainer = this._dialog.querySelector<HTMLDivElement>('dialog > div')!
    this._dialogContainer.addEventListener('click', (e) => e.stopPropagation())

    this._dialog.addEventListener('click', (e) => this._closeDialog({ e }))
  }

  static get observedAttributes() {
    return ['open']
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'open') {
      const dialog = this._shadowRoot.querySelector<HTMLDialogElement>('dialog')
      if (dialog) {
        if (newValue === 'true') {
          dialog.showModal()
        } else {
          dialog.close()
        }
      }
    }
  }

  private _closeDialog(options: { e?: MouseEvent; isDirectClose?: boolean }) {
    if (options.e?.target === this._dialog || options.isDirectClose) {
      this.dispatchEvent(new CustomEvent('close'))
    }
  }
}

customElements.define('core-dialog', CoreDialog)
