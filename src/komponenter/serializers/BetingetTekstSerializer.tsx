import type { PortableTextTypeComponentProps } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import React from 'react'
import type { Betingelser, Flettefelter } from '../../typer/dokumentApi'
import type { SchemaBetingetTekst } from '../../typer/schema'
import { FlettefeltSerializer } from './FlettefeltSerializer'

export interface BetingetTekstSerializerProps extends PortableTextTypeComponentProps<SchemaBetingetTekst> {
  betingelser: Betingelser
  flettefelter: Flettefelter
  dokumentApiNavn: string
}

export function BetingetTekstSerializer(props: BetingetTekstSerializerProps) {
  const {
    value: { betingelse, tekst },
    betingelser,
    flettefelter,
    dokumentApiNavn,
  } = props
  return betingelser[betingelse] ? (
    <PortableText
      value={tekst}
      components={{
        block({ children }) {
          return <>{children}</>
        },
        types: {
          flettefelt(props) {
            return <FlettefeltSerializer {...props} flettefelter={flettefelter} dokumentApiNavn={dokumentApiNavn} />
          },
        },
      }}
    />
  ) : null
}
