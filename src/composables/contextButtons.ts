import { ContextData } from '@/type'
import { textSelection } from '@/composables/rightClick.ts'

export const contextButtons: ContextData[] = [
  {
    label: 'Gras',
    action: ({ shadowRoot }) => {
      // Utilise la fonction execCommand pour appliquer le style gras
      // document.execCommand('bold')

      if (!textSelection.value) return

      if (textSelection.value.rangeCount > 0 && textSelection.value.toString().trim() !== '') {
        const range = textSelection.value.getRangeAt(0)

        const isInShadow = shadowRoot.contains(range.startContainer) && shadowRoot.contains(range.endContainer)

        if (isInShadow) {
          const span = document.createElement('span')
          span.style.backgroundColor = 'yellow' // Tu peux mettre ce que tu veux

          try {
            range.surroundContents(span)
            textSelection.value.removeAllRanges()
          } catch (err) {
            console.error("Impossible d'entourer le contenu sélectionné :", err)
          }
        } else {
          console.log('La sélection sort du shadowRoot.')
        }
      } else {
        console.log('Aucun texte sélectionné (ou sélection vide).')
      }
    },
  },
]
