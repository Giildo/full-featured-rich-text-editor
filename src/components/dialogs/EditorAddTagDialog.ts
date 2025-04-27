import '@/assets/style/dialogAddTag.css'

import { buttonsHtmlContent } from '@/composables/useItems.ts'
import { CoreDialog } from '@/components/utils/CoreDialog.ts'
import { addTagDialog } from '@/composables/useDialogs.ts'

export class EditorAddTagDialog {
  constructor(fullRichTextEditor: HTMLDivElement) {
    const div = document.createElement('div')
    div.classList.add('dialog-buttons-container')
    buttonsHtmlContent(div)

    const coreDialog = new CoreDialog(fullRichTextEditor, {
      contentClasses: ['full-featured-rich-text-editor-add-tag-dialog'],
      dialogContent: div,
      size: 38,
      title: 'Ajouter un élément HTML',
    })

    addTagDialog.value = coreDialog.dialog
  }
}
