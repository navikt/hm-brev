import type { PortableTextTypeComponentProps } from '@portabletext/react'
import type { Flettefelter } from '../../typer/dokumentApi'
import type { SchemaFlettefelt } from '../../typer/schema'
import { Feil } from '../../utils/Feil'

export interface FlettefeltSerializerProps extends PortableTextTypeComponentProps<SchemaFlettefelt> {
  flettefelter: Flettefelter
  dokumentApiNavn: string
}

export function FlettefeltSerializer(props: FlettefeltSerializerProps) {
  const { value, flettefelter, dokumentApiNavn } = props
  const { flettefelt } = value

  const flettefeltVerdi = flettefelter[flettefelt]

  if (flettefeltVerdi === undefined || flettefeltVerdi === '') {
    throw new Feil(`Flettefeltet "${flettefelt}" mangler for "${dokumentApiNavn}"`, 400)
  }

  return flettefeltVerdi
}
