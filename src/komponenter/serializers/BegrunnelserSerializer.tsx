import React from 'react'
import useServerEffect from '../../utils/useServerEffect'
import { hentBegrunnelseTekstQuery } from '../../sanity/Queries'
import type { Datasett } from '../../sanity/sanityClient'
import { client } from '../../sanity/sanityClient'
import { Feil } from '../../utils/Feil'
import type { Målform } from '../../typer/sanityGrensesnitt'
import { validerBegrunnelse } from '../../utils/valideringer/valideringer'
import begrunnelseSerializer from './begrunnelseSerializer'
import type { Begrunnelser } from '../../typer/typer'
import type { Flettefelter } from '../../typer/dokumentApi'

interface IPeriodeProps {
  sanityProps: any
  begrunnelser?: Begrunnelser
  flettefelter?: Flettefelter
  maalform: Målform
  datasett: Datasett
}

const BegrunnelserSerializer = (props: IPeriodeProps) => {
  const { begrunnelser, maalform, datasett, flettefelter } = props

  if (!begrunnelser) {
    throw new Feil('Mangler begrunnelser i payload', 400)
  }

  if (!flettefelter) {
    throw new Feil('Mangler flettefelter i payload', 400)
  }

  return (
    <div className={`delmal`}>
      <ul>
        {begrunnelser.map((begrunnelse, index) => (
          <BegrunnelseWrapper
            key={`${begrunnelse[0]}-${index}`}
            datasett={datasett}
            maalform={maalform}
            begrunnelse={begrunnelse}
            flettefelter={flettefelter}
          />
        ))}
      </ul>
    </div>
  )
}

const BegrunnelseWrapper = (props: {
  maalform: Målform
  datasett: Datasett
  begrunnelse: string
  flettefelter: Flettefelter
}) => {
  const { maalform, datasett, begrunnelse, flettefelter } = props

  const hentBegrunnelsetekst = (begrunnelseApiNavn: string, målform: Målform): any => {
    const query = hentBegrunnelseTekstQuery(begrunnelseApiNavn, målform)

    return useServerEffect(undefined, query, () =>
      client(datasett)
        .fetch(query)
        .then(begrunnelseFraSanity => {
          validerBegrunnelse(begrunnelseFraSanity, begrunnelseApiNavn)
          return begrunnelseFraSanity
        }),
    )[0]
  }

  const byggBegrunnelse = (begrunnelse: string, målform: Målform, flettefelter: Flettefelter) => {
    const begrunnelsetekstFraSanity = hentBegrunnelsetekst(begrunnelse, målform)
    return begrunnelsetekstFraSanity && begrunnelseSerializer(begrunnelsetekstFraSanity, begrunnelse, flettefelter)
  }

  const begrunnelseTekst = byggBegrunnelse(begrunnelse, maalform, flettefelter)

  return <li className={`block`}>{begrunnelseTekst}</li>
}

export default BegrunnelserSerializer
