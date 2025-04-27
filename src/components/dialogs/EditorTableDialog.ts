import '@/assets/style/dialogTable.css'

import { addTagTable } from '@/composables/addMethods.ts'
import { CoreDialog } from '@/components/utils/CoreDialog.ts'
import { tableDialog } from '@/composables/useDialogs.ts'

export class EditorTableDialog {
  private readonly _tableSize: HTMLParagraphElement = document.createElement('p')
  private _TDs: HTMLTableCellElement[] = []

  constructor(fullRichTextEditor: HTMLDivElement) {
    const div = document.createElement('div')
    div.classList.add('table-dialog-content')

    // Aside
    const aside = document.createElement('aside')

    // Aside - Checkbox
    const asideDiv = document.createElement('div')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.name = 'withHeader'
    checkbox.id = 'withHeader'
    checkbox.checked = true
    const label = document.createElement('label')
    label.setAttribute('for', 'withHeader')
    label.textContent = 'La première ligne est une en-tête'
    asideDiv.append(checkbox, label)

    // Aside - Paragraph
    this._tableSize.textContent = 'Tableau de 0 sur 0'

    aside.append(asideDiv, this._tableSize)
    div.append(aside)

    // Table
    const table = document.createElement('table')
    Array.from({ length: 10 }, (_, i) => {
      const tr = document.createElement('tr')
      Array.from({ length: 10 }, (_, j) => {
        const td = document.createElement('td')
        td.dataset.x = j.toString()
        td.dataset.y = i.toString()
        td.addEventListener('mouseover', () => {
          this._onMouseOver(parseInt(td.dataset.x!), parseInt(td.dataset.y!))
        })
        td.addEventListener('click', () => {
          addTagTable(parseInt(td.dataset.x!) + 1, parseInt(td.dataset.y!) + 1, checkbox.checked)
        })
        this._TDs.push(td)
        tr.appendChild(td)
      })
      table.appendChild(tr)
    })
    div.appendChild(table)

    const coreDialog = new CoreDialog(fullRichTextEditor, {
      title: 'Ajouter un tableau',
      size: 38,
      contentClasses: ['full-featured-rich-text-editor-table-dialog'],
      dialogContent: div,
    })
    tableDialog.value = coreDialog.dialog
  }

  private _onMouseOver(x: number, y: number) {
    this._TDs!.forEach((td) => {
      td.classList.toggle('hover', parseInt(td.dataset.x!) <= x && parseInt(td.dataset.y!) <= y)
    })

    this._tableSize!.textContent = `Tableau de ${x + 1} sur ${y + 1}`
  }
}
