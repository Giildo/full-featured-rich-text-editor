import dialogStyle from '@/assets/style/dialogTable.css?inline'

import { UseCoreDialog } from '@/components/utils/UseCoreDialog.ts'
import { addTagTable } from '@/composables/addMethods.ts'

export class EditorTableDialog extends UseCoreDialog {
  private tableSize: HTMLParagraphElement
  private tds: HTMLTableCellElement[] = []

  constructor() {
    super({
      dialogStyle,
      title: 'Ajouter un tableau',
      content: `<div class="table-dialog-content">
        <aside>
          <div>
            <input type="checkbox" name="withHeader" id="withHeader" checked>
            <label for="withHeader">La première ligne est une en-tête</label>
          </div>
          <p>Tableau de 0 sur 0</p>
        </aside>
        <table>
          ${Array.from(
            { length: 10 },
            (_, i) => `
            <tr>
              ${Array.from({ length: 10 }, (_, j) => `<td data-x="${j}" data-y="${i}"></td>`).join('')}
            </tr>
          `,
          ).join('')}
        </table>
      </div>`,
      size: 38,
    })

    this.tableSize = this.shadowRoot!.querySelector('aside p')!
    this.tds = Array.from(this.shadowRoot!.querySelectorAll('td'))

    this.tds.forEach((td) => {
      td.addEventListener('mouseover', () => {
        this._onMouseOver(parseInt(td.dataset.x!), parseInt(td.dataset.y!))
      })

      td.addEventListener('click', () => {
        addTagTable(
          parseInt(td.dataset.x!) + 1,
          parseInt(td.dataset.y!) + 1,
          (this.shadowRoot!.querySelector('input') as HTMLInputElement).checked,
        )
      })
    })
  }

  private _onMouseOver(x: number, y: number) {
    this.tds.forEach((td) => {
      td.classList.toggle('hover', parseInt(td.dataset.x!) <= x && parseInt(td.dataset.y!) <= y)
    })

    this.tableSize!.textContent = `Tableau de ${x + 1} sur ${y + 1}`
  }
}

customElements.define('editor-table-dialog', EditorTableDialog)
