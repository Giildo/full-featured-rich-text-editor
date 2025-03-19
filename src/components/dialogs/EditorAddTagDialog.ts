import dialogStyle from '@/assets/style/dialogAddTag.css?inline'
import { useItems } from '@/composables/useItems.ts'

import { UseCoreDialog } from '@/components/utils/UseCoreDialog.ts'

class EditorAddTagDialog extends UseCoreDialog {
  constructor() {
    const { buttonsHtmlContent } = useItems()

    super({
      dialogStyle,
      title: 'Ajouter un élément HTML',
      content: `<div class="dialog-buttons-container">${buttonsHtmlContent()}</div>`,
    })

    this._coreDialog?.addEventListener('close', () => this.dispatchEvent(new CustomEvent('close')))
    ;(this._coreDialog.querySelectorAll<HTMLButtonElement>('.dialog-buttons-container button') || []).forEach(
      (button) => {
        button.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('add-tag', { detail: button.dataset.type }))
        })
      },
    )
  }
}

customElements.define('editor-add-tag-dialog', EditorAddTagDialog)
