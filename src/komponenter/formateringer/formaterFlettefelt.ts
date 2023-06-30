import type { FlettefeltBlock } from '../../typer/typer'
import { Feil } from '../../utils/Feil'

export const formaterFlettefelt = (flettefeltBlock: FlettefeltBlock, data: any, apiNavn: string): string => {
  const flettefeltVerdi = data[flettefeltBlock.flettefelt]

  if (flettefeltVerdi === undefined || flettefeltVerdi === '') {
    throw new Feil(`Flettefeltet "${flettefeltBlock.flettefelt}" mangler for begrunnelse ${apiNavn}`, 400)
  }

  return flettefeltVerdi
}
