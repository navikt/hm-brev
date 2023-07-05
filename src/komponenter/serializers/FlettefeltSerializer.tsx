import { Feil } from '../../utils/Feil'

export interface FlettefeltSerializerProps {
  _type: 'flettefelt'
  flettefelt: string
}

export function FlettefeltSerializer(props: any /* fixme bruk FlettefeltSerializerProps */) {
  const { sanityProps, flettefelter, dokumentApiNavn } = props
  const { flettefelt } = sanityProps.value

  const flettefeltVerdi = flettefelter[flettefelt]

  if (flettefeltVerdi === undefined || flettefeltVerdi === '') {
    throw new Feil(`Flettefeltet "${flettefelt}" mangler for ${dokumentApiNavn}`, 400)
  }

  return flettefeltVerdi
}
