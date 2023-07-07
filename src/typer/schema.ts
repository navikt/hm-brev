import type { PortableTextBlock, PortableTextMarkDefinition, PortableTextSpan, TypedObject } from '@portabletext/types'

export interface SchemaFlettefelt extends TypedObject {
  _type: 'flettefelt'
  flettefelt: string
}

export type SchemaBegrunnelse = PortableTextBlock<PortableTextMarkDefinition, SchemaFlettefelt | PortableTextSpan>

export interface SchemaBetingetTekst extends TypedObject {
  _type: 'betingetTekst'
  betingelse: string
  tekst: TypedObject[]
}
