import '@@/assets/style/style.css'
import { RTEOption } from '@/index'

RTEOption.item.title = 'Test'
RTEOption.item.content = 'Content'

const app = document.getElementById('app')

if (app) {
  app.innerHTML = `<rich-text-editor/>`
}