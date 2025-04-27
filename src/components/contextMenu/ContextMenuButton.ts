import style from '@/assets/style/contextMenuButton.css?inline'

export class ContextMenuButton extends HTMLElement {
  private _shadowRoot: ShadowRoot
  private _button: HTMLButtonElement

  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.innerHTML = `
      <style>
        ${style}
      </style>
      <li>
        <button>
          <slot></slot>
        </button>
      </li>
    `

    this._button = this._shadowRoot.querySelector<HTMLButtonElement>('button')!
  }

  connectedCallback() {
    this._button?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('context-menu-button-click', { bubbles: true }))
    })
  }
}

customElements.define('context-menu-button', ContextMenuButton)
