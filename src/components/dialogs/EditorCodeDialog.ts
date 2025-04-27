import '@/assets/style/dialogCode.css'

import type { BundledLanguage } from 'shiki'
import type { CodeDialogFooterButton, CodeDialogOptions } from '@/type'

import { CoreDialog } from '@/components/utils/CoreDialog.ts'
import { addCodeBlock } from '@/composables/addMethods.ts'
import { removeCode } from '@/composables/removeMethods.ts'
import { codeDialog } from '@/composables/useDialogs.ts'

export class EditorCodeDialog {
  private _dialog: HTMLDialogElement

  private readonly _form: HTMLFormElement = document.createElement('form')
  private _languageSelect: HTMLSelectElement = document.createElement('select')
  private readonly _pre: HTMLPreElement = document.createElement('pre')

  // buttons
  private _removeBtn: HTMLButtonElement = document.createElement('button')
  private _submitBtn: HTMLButtonElement = document.createElement('button')
  private _cancelBtn: HTMLButtonElement = document.createElement('button')

  constructor(fullRichTextEditor: HTMLDivElement, { languages }: CodeDialogOptions) {
    // Language select
    const selectLabel = document.createElement('label')
    selectLabel.setAttribute('for', 'langages')
    selectLabel.textContent = 'Langage'
    this._form.appendChild(selectLabel)

    const internalLanguages: BundledLanguage[] = languages || [
      'css',
      'html',
      'js',
      'json',
      'php',
      'python',
      'sql',
      'ts',
      'xml',
    ]
    internalLanguages.forEach((language) => {
      const option = document.createElement('option')
      option.value = language.toLowerCase()
      option.textContent = language.toUpperCase()
      this._languageSelect!.appendChild(option)
    })
    this._form.appendChild(this._languageSelect!)

    // PRE
    const preLabel = document.createElement('label')
    preLabel.setAttribute('for', 'add-code-dialog-editor')
    preLabel.textContent = 'Mon code'
    this._form.appendChild(preLabel)

    this._pre.setAttribute('aria-labelledby', 'add-code-dialog-editor')
    this._pre.classList.add('scroll-custom')
    this._pre.setAttribute('contenteditable', 'true')
    this._form.appendChild(this._pre)

    // Footer
    const footer = document.createElement('footer')
    Array<CodeDialogFooterButton>(
      {
        icon: 'M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z',
        onClick: () => {},
        text: 'Annuler',
        type: 'reset',
      },
      {
        icon: 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z',
        onClick: () => {},
        text: 'Supprimer',
        type: 'button',
      },
      {
        icon: 'M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z',
        onClick: () => {},
        text: 'Insérer',
        type: 'submit',
      },
    ).forEach(({ icon, onClick, text, type }) => {
      const button = document.createElement('button')
      button.type = type
      button.addEventListener('click', (e) => onClick(e))

      switch (type) {
        case 'button':
          this._removeBtn = button
          break
        case 'submit':
          this._submitBtn = button
          break
        case 'reset':
          this._cancelBtn = button
          break
      }

      const span = document.createElement('span')
      span.textContent = text

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svg.setAttribute('viewBox', '0 0 24 24')

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', icon)

      svg.appendChild(path)
      button.append(span, svg)
      footer.appendChild(button)
    })
    this._form.appendChild(footer)

    const coreDialog = new CoreDialog(fullRichTextEditor, {
      contentClasses: ['full-featured-rich-text-editor-code-dialog'],
      dialogContent: this._form,
      size: 40,
      title: 'Ajouter du code',
    })
    codeDialog.value = coreDialog.dialog
    this._dialog = coreDialog.dialog

    this._initFormEvents()
    this._initPreEvents()
    this._resetSubmitButtonStatus()
    this._initDialogStatus()

    this._cancelBtn!.addEventListener('click', () => this._dialog!.close())
    this._removeBtn!.addEventListener('click', () => removeCode())
  }

  _resetLanguage() {
    this._languageSelect!.value = 'css'
    this._pre!.innerText = ''

    this._resetSubmitButtonStatus()
  }

  _initFormEvents() {
    this._form!.addEventListener('reset', () => this._resetLanguage())

    this._form!.addEventListener('submit', async (e) => {
      e.preventDefault()
      await addCodeBlock(this._languageSelect!, this._pre!)
      this._resetLanguage()
    })
  }

  _initPreEvents() {
    this._pre!.addEventListener('paste', (e) => {
      e.preventDefault()
      this._pre!.innerText = e.clipboardData?.getData('text') || ''

      this._resetSubmitButtonStatus()
    })

    this._pre!.addEventListener('input', () => this._resetSubmitButtonStatus())
  }

  _resetSubmitButtonStatus() {
    this._submitBtn!.disabled =
      this._pre!.innerText.length <= 0 || this._pre!.innerHTML === '<br>' || this._pre!.innerText === ' '

    if (this._submitBtn!.disabled) this._submitBtn!.title = 'Vous devez ajouter du code pour insérer'
    else this._submitBtn!.removeAttribute('title')
  }

  _initDialogStatus() {
    this._dialog.addEventListener('toggle', () => {
      const isUpdate = sessionStorage.getItem('item-update') !== null
      if (this._dialog.open) {
        this._removeBtn!.classList.toggle('displayed', isUpdate)
        this._submitBtn!.querySelector('span')!.textContent = isUpdate ? 'Mettre à jour' : 'Insérer'
        return
      }

      this._resetLanguage()

      if (isUpdate) sessionStorage.removeItem('item-update')
    })
  }
}
