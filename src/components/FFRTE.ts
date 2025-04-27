import type { FFRTEOptions } from '@/type'
import '@/components/contextMenu/ContextMenu.ts'
import { contentContainer } from '@/composables/useDialogs.ts'
import { initRightClick } from '@/composables/rightClick.ts'
import { EditorActions } from '@/components/EditorActions.ts'
import { ContextMenu } from '@/components/contextMenu/ContextMenu.ts'

export class FFRTE {
  private readonly _fullRichTextEditor: HTMLDivElement

  constructor({ container, item, color, languages }: FFRTEOptions) {
    if (!container) {
      throw new Error('Full-features rich text editor: The container is required')
    }

    if (item?.title === undefined || item?.content === undefined) {
      throw new Error('Full-features rich text editor: The item is required and must have a title and content')
    }

    container.innerHTML = `
      <div
        id="full-rich-text-editor-container"
        style="--decoration-color: ${color ?? 'oklch(0.881 0.142 201.59)'}"
        role="application"
      >
        <header>
          <label id="editor-container-title-label">Titre de votre article</label>
          <h1 contenteditable="true" aria-labelledby="editor-container-title-label">${item?.title ?? ''}</h1>
        </header>
        <section>
          <label id="editor-container-content-label">Contenu de votre article</label>
          <div class="context-container">
            <div 
              aria-labelledby="editor-container-content-label"
              class="scroll-custom"
            >
              ${item?.content ?? ''}
            </div>
          </div>
        </section>
      </div>
    `

    this._fullRichTextEditor = container.querySelector<HTMLDivElement>('#full-rich-text-editor-container')!

    new EditorActions(this._fullRichTextEditor, { languages })
    new ContextMenu(this._fullRichTextEditor)

    contentContainer.value = container.querySelector<HTMLDivElement>(
      '[aria-labelledby="editor-container-content-label"]',
    )

    initRightClick(container.querySelector<HTMLDivElement>('.context-container')!)
  }
}
