import type { PortableTextSpan } from '@portabletext/types'
import type { Flettefelter } from '../../typer/dokumentApi'
import type { SchemaBegrunnelse, SchemaFlettefelt } from '../../typer/schema'
import { Feil } from '../../utils/Feil'
import { formaterFlettefelt } from '../formateringer/formaterFlettefelt'

export function begrunnelseSerializer(
  blocks: SchemaBegrunnelse[],
  begrunnelseApiNavn: string,
  flettefelter: Flettefelter,
): string {
  if (!Array.isArray(blocks)) {
    throw new Feil(`Fant ikke begrunnelse med apiNavn: ${begrunnelseApiNavn}`, 404)
  }
  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map(child => formaterSanityBlock(child, flettefelter, begrunnelseApiNavn)).join('')
      }
      return ''
    })
    .join('\n\n')
}

function formaterSanityBlock(
  block: PortableTextSpan | SchemaFlettefelt | any,
  flettefelter: Flettefelter,
  begrunnelseApiNavn: string,
): string {
  switch (block._type) {
    case 'span':
      return block.text
    case 'flettefelt':
      return formaterFlettefelt(block, flettefelter, begrunnelseApiNavn)
    default:
      throw new Feil(`Ukjent block fra santity. Det er ikke laget noen funksjonalitet for ${block._type}`, 400)
  }
}
