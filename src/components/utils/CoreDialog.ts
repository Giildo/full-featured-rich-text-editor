import '@/assets/style/dialog.css'
import type { CoreDialogOptions } from '@/type'

export class CoreDialog {
  dialog: HTMLDialogElement = document.createElement('dialog')

  constructor(fullRichTextEditor: HTMLDivElement, { contentClasses, dialogContent, size, title }: CoreDialogOptions) {
    this.dialog = document.createElement('dialog')
    this.dialog.classList.add('full-featured-rich-text-editor-dialog')
    contentClasses?.forEach((contentClass) => {
      this.dialog.classList.add(contentClass)
    })
    this.dialog.style.setProperty('--dialog-size', `${size ?? 20}rem`)

    const dialogContainer = document.createElement('div')
    dialogContainer.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    // Header
    const header = document.createElement('header')
    const titleElement = document.createElement('h3')
    titleElement.textContent = title
    header.append(titleElement)

    const closeButton = document.createElement('button')
    closeButton.title = 'Fermer la fenêtre'
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="var(--text-color)" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`
    closeButton.addEventListener('click', () => {
      this.dialog.close()
    })
    header.append(closeButton)
    dialogContainer.append(header)

    // Section
    const section = document.createElement('section')
    section.append(dialogContent)
    dialogContainer.append(section)

    this.dialog.append(dialogContainer)
    this.dialog.addEventListener('click', (e) => {
      if (e?.target === this.dialog) {
        this.dialog.close()
      }
    })

    fullRichTextEditor.insertAdjacentElement('afterbegin', this.dialog)
  }
}
