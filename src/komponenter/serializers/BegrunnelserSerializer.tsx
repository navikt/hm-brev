import React from 'react'
import { hentBegrunnelseTekstQuery } from '../../sanity/Queries'
import type { Datasett } from '../../sanity/sanityClient'
import { client } from '../../sanity/sanityClient'
import type { Flettefelter } from '../../typer/dokumentApi'
import type { Målform } from '../../typer/sanityGrensesnitt'
import type { Begrunnelser } from '../../typer/typer'
import { Feil } from '../../utils/Feil'
import { useServerEffect } from '../../utils/useServerEffect'
import { validerBegrunnelse } from '../../utils/valideringer/valideringer'
import { begrunnelseSerializer } from './begrunnelseSerializer'

export interface BegrunnelserSerializerProps {
  sanityProps: any
  begrunnelser?: Begrunnelser
  flettefelter?: Flettefelter
  målform: Målform
  datasett: Datasett
}

export function BegrunnelserSerializer(props: BegrunnelserSerializerProps) {
  const { begrunnelser, målform, datasett, flettefelter } = props

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
            målform={målform}
            begrunnelse={begrunnelse}
            flettefelter={flettefelter}
          />
        ))}
      </ul>
    </div>
  )
}

function BegrunnelseWrapper(props: {
  målform: Målform
  datasett: Datasett
  begrunnelse: string
  flettefelter: Flettefelter
}) {
  const { målform, datasett, begrunnelse, flettefelter } = props

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

  const begrunnelseTekst = byggBegrunnelse(begrunnelse, målform, flettefelter)

  return <li className={`block`}>{begrunnelseTekst}</li>
}
