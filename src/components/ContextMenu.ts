import style from '@/assets/style/contextMenu.css?inline'
import { contextMenu } from '@/composables/rightClick.ts'

export class ContextMenu extends HTMLElement {
  private _shadowRoot: ShadowRoot

  constructor() {
    super()

    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.innerHTML = `
      <style>
        ${style}
      </style>
      <div id="contextMenu">
        <ul>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
        </ul>
      </div>
    `

    contextMenu.value = this._shadowRoot.querySelector<HTMLElement>('#contextMenu')
  }
}

customElements.define('context-menu', ContextMenu)
