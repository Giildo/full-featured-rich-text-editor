import dialogStyle from '@/assets/style/dialogCode.css?inline'
import { UseCoreDialog } from '@/components/utils/UseCoreDialog.ts'
import { codeDialog, insertCode } from '@/composables/useDialogs.ts'

class EditorCodeDialog extends UseCoreDialog {
  constructor() {
    super({
      dialogStyle,
      title: 'Ajouter du code',
      size: 40,
      content: `<form>
  <label for="langages">Langage</label>
  <select id="langages">
    <option value="css">CSS</option>
    <option value="html">HTML</option>
    <option value="js">JS</option>
    <option value="json">JSON</option>
    <option value="php">PHP</option>
    <option value="python">Python</option>
    <option value="sql">SQL</option>
    <option value="ts">TS</option>
    <option value="xml">XML</option>
  </select>
  
  <label id="add-code-dialog-editor">Mon code</label>
  <pre
    aria-labelledby="add-code-dialog-editor"
    class="scroll-custom"
    contenteditable="true"
  ></pre>
  
  <button type="submit">
    Insérer
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
    </svg>
  </button>
</form>`,
    })
    if (!this._coreDialog) return

    const languageSelect = this._coreDialog.querySelector<HTMLSelectElement>('#langages')!
    const pre = this._coreDialog.querySelector<HTMLPreElement>('pre')!

    pre.addEventListener('paste', function (e) {
      e.preventDefault()
      this.innerText = e.clipboardData?.getData('text') || ''
    })

    this._coreDialog.querySelector<HTMLFormElement>('form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      await insertCode(languageSelect.value || '', pre.innerText || '')

      languageSelect.value = 'css'
      pre.innerText = ''
    })

    Promise.resolve().then(() => {
      codeDialog.value?.addEventListener('close', () => {
        languageSelect.value = 'css'
        pre.innerText = ''
      })
    })
  }
}

customElements.define('editor-code-dialog', EditorCodeDialog)
