import { PortableText } from '@portabletext/react'
import React from 'react'
import { hentDokumentQuery } from '../sanity/Queries'
import type { Datasett } from '../sanity/sanityClient'
import { client } from '../sanity/sanityClient'
import type { DokumentData } from '../typer/dokumentApi'
import { DokumentType } from '../typer/DokumentType'
import type { Målform } from '../typer/sanityGrensesnitt'
import { Feil } from '../utils/Feil'
import { useServerEffect } from '../utils/useServerEffect'
import { BegrunnelserSerializer } from './serializers/BegrunnelserSerializer'
import { BetingetTekstSerializer } from './serializers/BetingetTekstSerializer'
import { BlockSerializer } from './serializers/BlockSerializer'
import { DelmalSerializer } from './serializers/DelmalSerializer'
import { FlettefeltSerializer } from './serializers/FlettefeltSerializer'

export interface DokumentProps {
  dokumentApiNavn: string
  dokumentData?: DokumentData
  målform: Målform
  datasett: Datasett
}

export function Dokument(props: DokumentProps) {
  const { dokumentApiNavn, dokumentData, målform, datasett } = props
  const [dokument] = useServerEffect(undefined, dokumentApiNavn, () => {
    const query = hentDokumentQuery(DokumentType.DOKUMENT, dokumentApiNavn, målform)
    return client(datasett)
      .fetch(query)
      .then((res: any) => {
        if (!res[målform]) {
          throw new Feil(`Fant ikke ${målform}-tekst for "${dokumentApiNavn}" i datasettet "${datasett}"`, 404)
        }

        return res[målform]
      })
  })

  if (!dokument) {
    return null
  }

  const { flettefelter = {}, betingelser = {}, begrunnelser = [] } = dokumentData || {}

  return (
    <PortableText
      value={dokument}
      components={{
        block: BlockSerializer,
        types: {
          delmal(props) {
            return (
              <DelmalSerializer
                {...props}
                målform={målform}
                betingelser={betingelser}
                flettefelter={flettefelter}
                dokumentApiNavn={dokumentApiNavn}
              />
            )
          },
          begrunnelser(props) {
            return (
              <BegrunnelserSerializer
                {...props}
                begrunnelser={begrunnelser}
                flettefelter={flettefelter}
                målform={målform}
                datasett={datasett}
              />
            )
          },
          betingetTekst(props) {
            return (
              <BetingetTekstSerializer
                {...props}
                betingelser={betingelser}
                flettefelter={flettefelter}
                dokumentApiNavn={dokumentApiNavn}
              />
            )
          },
          flettefelt(props) {
            return <FlettefeltSerializer {...props} flettefelter={flettefelter} dokumentApiNavn={dokumentApiNavn} />
          },
        },
        marks: {
          betingetVisning(props) {
            return 'TODO'
          },
        },
      }}
    />
  )
}
