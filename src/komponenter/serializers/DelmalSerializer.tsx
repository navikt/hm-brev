import type { PortableTextTypeComponentProps } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import React from 'react'
import type { Målform } from '../../typer/sanityGrensesnitt'
import { BlockSerializer } from './BlockSerializer'
import { BetingetTekstSerializer } from './BetingetTekstSerializer'
import type { Betingelser, Flettefelter } from '../../typer/dokumentApi'

export interface DelmalSerializerProps extends PortableTextTypeComponentProps<{ delmalReferanse: any }> {
  målform: Målform
  betingelser: Betingelser
  flettefelter: Flettefelter
  dokumentApiNavn: string
}

export function DelmalSerializer(props: DelmalSerializerProps) {
  const { value, målform, betingelser = {}, flettefelter, dokumentApiNavn } = props
  const { delmalReferanse } = value

  // todo -> flettefelt i delmaler er ikke støttet ennå

  return (
    <div className="delmal">
      <PortableText
        value={delmalReferanse[målform]}
        components={{
          block: BlockSerializer,
          types: {
            undefined: () => <div />,
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
          },
        }}
      />
    </div>
  )
}
