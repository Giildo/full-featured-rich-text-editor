import dialogStyle from '@/assets/style/dialogAddTag.css?inline'
import { useItems } from '@/composables/useItems.ts'

import { UseCoreDialog } from '@/components/utils/UseCoreDialog.ts'
import { _addTag } from '@/components/dialogs/useDialogs.ts'
import type { DialogType } from '@/vite-env'

export class EditorAddTagDialog extends UseCoreDialog {
  constructor() {
    const { buttonsHtmlContent } = useItems()

    super({
      dialogStyle,
      title: 'Ajouter un élément HTML',
      content: `<div class="dialog-buttons-container">${buttonsHtmlContent()}</div>`,
    })
    ;(this._coreDialog?.querySelectorAll<HTMLButtonElement>('.dialog-buttons-container button') || []).forEach(
      (button) => {
        button.addEventListener('click', async () => {
          await _addTag(button.dataset.type as DialogType)
        })
      },
    )
  }
}

customElements.define('editor-add-tag-dialog', EditorAddTagDialog)
