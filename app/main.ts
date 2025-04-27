import '@@/assets/style/style.css'
import '@/index'
import { FFRTE } from '@/components/FFRTE.ts'
import { FFRTEItem } from '@/type'

const item: FFRTEItem = {
  title: '',
  content: '',
}
const app = document.getElementById('app')!
new FFRTE({
  item,
  container: app,
})
