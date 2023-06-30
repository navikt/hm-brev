import type { Flettefelter } from '../../typer/dokumentApi'
import type { BegrunnelseBlock, FlettefeltBlock, SpanBlock } from '../../typer/typer'
import { Feil } from '../../utils/Feil'
import { formaterFlettefelt } from '../formateringer/formaterFlettefelt'

const begrunnelseSerializer = (
  blocks: BegrunnelseBlock[] | Record<string, never>,
  begunnelseApiNavn: string,
  flettefelter: Flettefelter,
): string => {
  if (!Array.isArray(blocks)) {
    throw new Feil(`Fant ikke begrunnelse med apiNavn=${begunnelseApiNavn}`, 404)
  }
  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => formaterSanityBlock(child, flettefelter, begunnelseApiNavn)).join('')
      }
      return ''
    })
    .join('\n\n')
}

const formaterSanityBlock = (
  block: SpanBlock | FlettefeltBlock | any,
  flettefelter: Flettefelter,
  begunnelseApiNavn: string,
): string => {
  switch (block._type) {
    case 'span':
      return block.text
    case 'flettefelt':
      return formaterFlettefelt(block, flettefelter, begunnelseApiNavn)
    default:
      throw new Feil(`Ukjent block fra santity. Det er ikke laget noen funksjonalitet for ${block._type}`, 400)
  }
}

export default begrunnelseSerializer
