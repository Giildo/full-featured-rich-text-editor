import '@/components/contextMenu/ContextMenuButton.ts'

export class ContextMenu {
  dialog: HTMLDialogElement = document.createElement('dialog')

  constructor(fullRichTextEditor: HTMLDivElement) {
    const dialog = document.createElement('dialog')
    dialog.setAttribute('popover', '')

    const list = document.createElement('ul')

    const li = document.createElement('li')
    li.innerText = 'test'
    li.addEventListener('click', () => {
      console.log('test')
    })
    list.appendChild(li)
    list.appendChild(li)
    list.appendChild(li)
    dialog.appendChild(list)
    fullRichTextEditor.appendChild(dialog)

    /*contextMenu.value = this._shadowRoot.querySelector<HTMLDivElement>('#contextMenu')!

    const ul = contextMenu.value.querySelector<HTMLUListElement>('ul')!
    contextButtons.forEach((button) => {
      const contextMenuButton = document.createElement('context-menu-button')
      contextMenuButton.innerText = button.label
      contextMenuButton.addEventListener('context-menu-button-click', (e) => {
        e.stopPropagation()
        button.action({
          e,
          shadowRoot: this._shadowRoot,
        })
      })
      ul.appendChild(contextMenuButton)
    })*/
  }
}
