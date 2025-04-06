import containerStyle from '@/assets/style/index.css?inline'

import '@/components/ContextMenu'
import '@/components/EditorActions'

import { contentContainer } from '@/composables/useDialogs.ts'
import { initRightClick } from '@/composables/rightClick.ts'

export const RTEOption = {
  item: {
    title: '',
    content: '',
  },
}

export class FFRTE extends HTMLElement {
  private _shadowRoot: ShadowRoot

  constructor() {
    super()

    if (RTEOption?.item?.title === undefined || RTEOption?.item?.content === undefined) {
      throw new Error('Full-features rich text editor: The item is required and must have a title and content')
    }

    this._shadowRoot = this.attachShadow({ mode: 'open' })

    this._shadowRoot.innerHTML = `
      <style>
        :host {
          --decoration-color: ${this.getAttribute('color') ?? 'oklch(0.881 0.142 201.59)'};
        }
        
        ${containerStyle}
      </style>
      <div id="editor-container">
        <editor-actions></editor-actions>
      
        <header>
          <label id="editor-container-title-label">Titre de votre article</label>
          <h1 contenteditable="true" aria-labelledby="editor-container-title-label">${RTEOption?.item?.title ?? ''}</h1>
        </header>
        <section>
          <label id="editor-container-content-label">Contenu de votre article</label>
          <div class="context-container">
            <context-menu></context-menu>
            <div 
              aria-labelledby="editor-container-content-label"
              class="scroll-custom"
            >
              ${RTEOption?.item?.content ?? ''}
            </div>
          </div>
        </section>
      </div>
    `

    contentContainer.value = this._shadowRoot.querySelector<HTMLDivElement>('.context-container')

    initRightClick(contentContainer.value!)
  }

  static get observedAttributes() {
    return ['color']
  }
}
