import dialogStyle from '@/assets/style/dialog.css?inline'

export class CoreDialog extends HTMLElement {
  private readonly _dialog: HTMLDialogElement

  constructor() {
    super()

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `
      <style>
        ${dialogStyle}
        
        :host {
          --dialog-size: ${this.getAttribute('size') ?? '20'}rem;
        }
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

    this._dialog = shadowRoot.querySelector<HTMLDialogElement>('dialog')!
    this._dialog.querySelector<HTMLButtonElement>('div > header > button')!.addEventListener('click', () => {
      this._dialog.close()
    })

    this._dialog.querySelector<HTMLDivElement>('dialog > div')!.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    this._dialog.addEventListener('click', (e) => {
      if (e?.target === this._dialog) {
        this._dialog.close()
      }
    })
  }

  public get dialog(): HTMLDialogElement {
    return this._dialog
  }
}

customElements.define('core-dialog', CoreDialog)
