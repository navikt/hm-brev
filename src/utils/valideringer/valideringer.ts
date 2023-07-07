import { Feil } from '../Feil'

export function validerBegrunnelse(begrunnelseFraSanity: any, apiNavn: string) {
  if (begrunnelseFraSanity === null) {
    throw new Feil(`Fant ikke begrunnelse med apiNavn: ${apiNavn}`, 404)
  }
}
