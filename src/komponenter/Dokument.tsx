import { PortableText } from '@portabletext/react'
import React from 'react'
import { hentDokumentQuery } from '../sanity/Queries'
import type { Datasett } from '../sanity/sanityClient'
import { client } from '../sanity/sanityClient'
import type { IDokumentData } from '../typer/dokumentApi'
import { DokumentType } from '../typer/DokumentType'
import type { Målform } from '../typer/sanityGrensesnitt'
import { Feil } from '../utils/Feil'
import { useServerEffect } from '../utils/useServerEffect'
import { BegrunnelserSerializer } from './serializers/BegrunnelserSerializer'
import { BlockSerializer } from './serializers/BlockSerializer'
import { DelmalSerializer } from './serializers/DelmalSerializer'
import { FlettefeltSerializer } from './serializers/FlettefeltSerializer'

export interface DokumentProps {
  dokumentApiNavn: string
  dokumentData: IDokumentData | undefined
  målform: Målform
  datasett: Datasett
}

export function Dokument(dokumentProps: DokumentProps) {
  const { dokumentApiNavn, dokumentData, målform, datasett } = dokumentProps

  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentDokumentQuery(DokumentType.DOKUMENT, dokumentApiNavn, målform)
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        if (!res[målform]) {
          throw new Feil(`Fant ikke ${målform} tekst for "${dokumentApiNavn}" i datasettet "${datasett}"`, 404)
        }

        return res[målform]
      })
  })

  if (!dokument) {
    return null
  }

  return (
    <PortableText
      value={dokument}
      components={{
        block: BlockSerializer,
        types: {
          delmal: (props: any) =>
            DelmalSerializer({
              sanityProps: props,
              delmalData: dokumentData?.delmalData,
              målform,
            }),
          flettefelt: (props: any) =>
            FlettefeltSerializer({
              sanityProps: props,
              flettefelter: dokumentData?.flettefelter,
              dokumentApiNavn,
            }),
          begrunnelser: (props: any) =>
            BegrunnelserSerializer({
              sanityProps: props,
              begrunnelser: dokumentData?.begrunnelser,
              flettefelter: dokumentData?.flettefelter,
              målform,
              datasett,
            }),
        },
      }}
    />
  )
}
