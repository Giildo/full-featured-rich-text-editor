import '@/assets/style/contextMenu.css'

import '@/components/contextMenu/ContextMenuButton.ts'
import {
  contextBold,
  contextItalic,
  contextLang,
  contextMenuDialog,
  contextMenuDialogList,
} from '@/composables/rightClick.ts'

export class ContextMenu {
  dialog: HTMLDialogElement = document.createElement('dialog')

  _buttons: { label: string; action: () => void }[] = [
    { label: 'Gras', action: contextBold },
    { label: 'Italique', action: contextItalic },
    { label: 'Anglais', action: contextLang },
  ]

  constructor(fullRichTextEditor: HTMLDivElement) {
    this.dialog = document.createElement('dialog')
    this.dialog.setAttribute('popover', '')
    this.dialog.classList.add('full-featured-rich-text-editor-context-menu-dialog')

    const list = document.createElement('ul')

    this._buttons.forEach(({ label, action }) => {
      const li = document.createElement('li')
      li.innerHTML = `<button>${label}</button>`
      li.addEventListener('click', () => {
        action()
        this.dialog.close()
      })
      list.appendChild(li)
    })
    this.dialog.appendChild(list)
    fullRichTextEditor.appendChild(this.dialog)

    contextMenuDialog.value = this.dialog
    contextMenuDialogList.value = list
  }
}
