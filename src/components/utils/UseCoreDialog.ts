import '@/components/utils/CoreDialog.ts'
import type { CoreDialogInterface } from '@/vite-env'

interface EditorAddTagDialogOptions {
  content: string
  dialogStyle: string
  title: string
}

export class UseCoreDialog extends HTMLElement {
  protected readonly _coreDialog: CoreDialogInterface | null = null

  constructor({ content, dialogStyle, title }: EditorAddTagDialogOptions) {
    super()

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `
      <style>
        ${dialogStyle}
      </style>
      <core-dialog dialog-item="true">
        <h3 slot="title">${title}</h3>
        
        ${content}
      </core-dialog>
    `

    this._coreDialog = shadowRoot.querySelector<CoreDialogInterface>('core-dialog')!
  }

  public get dialog(): HTMLDialogElement {
    return this._coreDialog!.dialog
  }
}
