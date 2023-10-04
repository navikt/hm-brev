import type { SchemaFlettefelt } from '../../typer/schema'
import { Feil } from '../../utils/Feil'

export function formaterFlettefelt({ flettefelt }: SchemaFlettefelt, data: any, apiNavn: string): string {
  const flettefeltVerdi = data[flettefelt]

  if (flettefeltVerdi == null) {
    throw new Feil(`Flettefeltet "${flettefelt}" mangler for begrunnelse ${apiNavn}`, 400)
  }

  return flettefeltVerdi
}
