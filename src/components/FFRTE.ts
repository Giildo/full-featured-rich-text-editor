import type { DialogType } from '@/vite-env'

import containerStyle from '@/assets/style/container.css?inline'

import '@/components/EditorActions'
import { codeToHtml } from 'shiki/bundle/web'
import { ref, Ref, watch } from '@/utils/ref.ts'

export const RTEOption = {
  item: {
    title: '',
    content: '',
  },
}

export class FFRTE extends HTMLElement {
  private _shadowRoot: ShadowRoot

  private readonly _contentContainer: HTMLDivElement | null = null

  private readonly _codeDialogOpen: Ref<boolean> = ref<boolean>(false)
  private readonly _addTagDialogOpen: Ref<boolean> = ref<boolean>(false)

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
        <editor-actions 
          code-dialog-open="${this._codeDialogOpen.value}"
          add-tag-dialog-open="${this._addTagDialogOpen.value}"
        >
        </editor-actions>
      
        <header>
          <label id="editor-container-title-label">Titre de votre article</label>
          <h1 contenteditable="true" aria-labelledby="editor-container-title-label">${RTEOption?.item?.title ?? ''}</h1>
        </header>
        <section>
          <label id="editor-container-content-label">Contenu de votre article</label>
          <div aria-labelledby="editor-container-content-label">
            ${RTEOption?.item?.content ?? ''}
          </div>
        </section>
      </div>
    `

    const editorActions = this._shadowRoot.querySelector<HTMLElement>('editor-actions')
    editorActions?.addEventListener('add-tag', async (e) => {
      await this._addTag(e as CustomEvent)
    })
    editorActions?.addEventListener('add-tag-dialog-open', (e) => {
      this._addTagDialogOpen.value = (e as CustomEvent).detail
    })

    this._contentContainer = this._shadowRoot.querySelector<HTMLDivElement>(
      '[aria-labelledby="editor-container-content-label"]',
    )

    this._addTagDialogOpen = watch(this._addTagDialogOpen, () => {
      editorActions?.setAttribute('add-tag-dialog-open', `${this._addTagDialogOpen.value}`)
    })
    this._codeDialogOpen = watch(this._codeDialogOpen, () => {
      editorActions?.setAttribute('code-dialog-open', `${this._codeDialogOpen.value}`)
    })
  }

  static get observedAttributes() {
    return ['color']
  }

  private async _addTag(e: CustomEvent<DialogType>) {
    let item: HTMLElement | null = null
    switch (e.detail) {
      case 'p':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        item = document.createElement(e.detail)
        item.contentEditable = 'true'
        this._contentContainer?.appendChild(item)
        this._addTagDialogOpen.value = false
        Promise.resolve().then(() => {
          item!.focus()
        })
        break
      case 'code':
        item = document.createElement('div')
        item.innerHTML = await codeToHtml('const age = 18', {
          lang: 'typescript',
          themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha',
          },
        })
        item = item.querySelector<HTMLElement>('pre')
        if (!item) break
        item.addEventListener('click', () => {
          console.log('Open code editor')
        })
        this._contentContainer?.appendChild(item)
        break
    }
  }
}
