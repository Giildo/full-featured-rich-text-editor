import dialogStyle from '@/assets/style/dialogAddTag.css?inline'
import { buttonsHtmlContent } from '@/composables/useItems.ts'

import { UseCoreDialog } from '@/components/utils/UseCoreDialog.ts'
import { addTag } from '@/composables/useDialogs.ts'
import type { DialogType } from '@/type'

export class EditorAddTagDialog extends UseCoreDialog {
  constructor() {
    super({
      dialogStyle,
      title: 'Ajouter un élément HTML',
      content: `<div class="dialog-buttons-container">${buttonsHtmlContent()}</div>`,
      size: 38,
    })
    ;(this._coreDialog?.querySelectorAll<HTMLButtonElement>('.dialog-buttons-container button') || []).forEach(
      (button) => {
        button.addEventListener('click', () => {
          addTag(button.dataset.type as DialogType)
        })
      },
    )
  }
}

customElements.define('editor-add-tag-dialog', EditorAddTagDialog)
