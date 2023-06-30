import React from 'react'
import { PortableText } from '@portabletext/react'
import type { IDokumentData } from '../typer/dokumentApi'
import type { Målform } from '../typer/sanityGrensesnitt'
import type { Datasett } from '../sanity/sanityClient'
import { client } from '../sanity/sanityClient'
import { Feil } from '../utils/Feil'
import useServerEffect from '../utils/useServerEffect'
import { hentDokumentQuery } from '../sanity/Queries'
import { dokumentType } from '../typer/DokumentType'
import BlockSerializer from './serializers/BlockSerializer'
import DelmalSerializer from './serializers/DelmalSerializer'
import FlettefeltSerializer from './serializers/FlettefeltSerializer'
import BegrunnelserSerializer from './serializers/BegrunnelserSerializer'

interface DokumentProps {
  dokumentApiNavn: string
  dokumentData: IDokumentData | undefined
  maalform: Målform
  datasett: Datasett
}

const Dokument = (dokumentProps: DokumentProps) => {
  const { dokumentApiNavn, dokumentData, maalform, datasett } = dokumentProps

  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentDokumentQuery(dokumentType.DOKUMENT, dokumentApiNavn, maalform)
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        if (!res[maalform]) {
          throw new Feil(`Fant ikke ${maalform} tekst for "${dokumentApiNavn}" i datasettet "${datasett}"`, 404)
        }

        return res[maalform]
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
              maalform,
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
              maalform,
              datasett,
            }),
        },
      }}
    />
  )
}

export default Dokument
