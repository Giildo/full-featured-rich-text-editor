import dialogStyle from '@/assets/style/dialogCode.css?inline'
import { UseCoreDialog } from '@/components/utils/UseCoreDialog.ts'
import { codeDialog, insertCode, removeCode } from '@/composables/useDialogs.ts'

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
  
  <footer>
    <button type="reset">
      Annuler
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z" />
      </svg>
    </button>
    
    <button type="button">
      Supprimer
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
      </svg>
    </button>
    
    <button type="submit">
      <span>Insérer</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
      </svg>
    </button>
  </footer>
</form>`,
    })
    if (!this._coreDialog) return

    const languageSelect = this._coreDialog.querySelector<HTMLSelectElement>('#langages')!
    const form = this._coreDialog.querySelector<HTMLFormElement>('form')!
    const pre = this._coreDialog.querySelector<HTMLPreElement>('pre')!

    const removeBtn = this._coreDialog.querySelector<HTMLButtonElement>('button[type="button"]')!
    const submitBtn = this._coreDialog.querySelector<HTMLButtonElement>('button[type="submit"]')!
    const cancelBtn = this._coreDialog.querySelector<HTMLButtonElement>('button[type="reset"]')!

    pre.addEventListener('paste', function (e) {
      e.preventDefault()
      this.innerText = e.clipboardData?.getData('text') || ''

      submitBtn.disabled = this.innerText.length <= 0 || this.innerHTML === '<br>' || this.innerText === ' '
      if (submitBtn.disabled) submitBtn.title = 'Vous devez ajouter du code pour insérer'
      else submitBtn.removeAttribute('title')
    })

    submitBtn.disabled = this.innerText.length <= 0 || this.innerHTML === '<br>' || this.innerText === ' '
    if (submitBtn.disabled) submitBtn.title = 'Vous devez ajouter du code pour insérer'
    pre.addEventListener('input', function () {
      submitBtn.disabled = this.innerText.length <= 0 || this.innerHTML === '<br>' || this.innerText === ' '
      if (submitBtn.disabled) submitBtn.title = 'Vous devez ajouter du code pour insérer'
      else submitBtn.removeAttribute('title')
    })

    cancelBtn.addEventListener('click', () => codeDialog.value?.close())

    removeBtn.addEventListener('click', () => removeCode())

    form?.addEventListener('submit', async (e) => {
      e.preventDefault()
      await insertCode(languageSelect, pre)

      languageSelect.value = 'css'
      pre.innerText = ''
    })

    form?.addEventListener('reset', () => {
      languageSelect.value = 'css'
      pre.innerText = ''
    })

    Promise.resolve().then(() => {
      codeDialog.value?.addEventListener('toggle', () => {
        const isUpdate = sessionStorage.getItem('item-update') !== null
        if (codeDialog.value?.open) {
          removeBtn.classList.toggle('displayed', isUpdate)
          submitBtn.querySelector('span')!.textContent = isUpdate ? 'Mettre à jour' : 'Insérer'
          return
        }

        languageSelect.value = 'css'
        pre.innerText = ''

        if (isUpdate) sessionStorage.removeItem('item-update')
      })
    })
  }
}

customElements.define('editor-code-dialog', EditorCodeDialog)
