import containerStyle from '@/assets/style/container.css?inline'
import '@/components/EditorActions'

export interface FFRTEItem {
  title: string
  content: string
}

export const RTEOption = {
  item: {
    title: '',
    content: '',
  },
}

export interface FFRTEOptions {
  item: FFRTEItem
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
          <div aria-labelledby="editor-container-content-label">
            ${RTEOption?.item?.content ?? ''}
            ${[...Array(100)].map(() => `<p>Paragraphe</p>`).join('')}
          </div>
        </section>
      </div>
    `
  }
}
