import type { PortableTextTypeComponentProps } from '@portabletext/react'
import type { Flettefelter } from '../../typer/dokumentApi'
import type { SchemaFlettefelt } from '../../typer/schema'
import { Feil } from '../../utils/Feil'
import React from 'react'
import { marked } from 'marked'

export interface FlettefeltSerializerProps extends PortableTextTypeComponentProps<SchemaFlettefelt> {
  flettefelter: Flettefelter
  dokumentApiNavn: string
}

export function FlettefeltSerializer(props: FlettefeltSerializerProps) {
  const { value, flettefelter, dokumentApiNavn } = props
  const { flettefelt } = value

  const flettefeltVerdi = flettefelter[flettefelt]

  if (flettefeltVerdi == null) {
    throw new Feil(`Flettefeltet "${flettefelt}" mangler for "${dokumentApiNavn}"`, 400)
  }

  if (flettefelt == "markdown") {
    const md = fiksAvkryssingsbokser(marked.parse(flettefeltVerdi, { async: false }))
    return (
        <div dangerouslySetInnerHTML={{ __html: md }} />
    )
  }

  return (
      <>
        {flettefeltVerdi}
      </>
  )
}

function fiksAvkryssingsbokser(md: string): string {
  // Avkryssingsbokser som er krysset ut funker litt dårlig med openhtmltopdf, bytter de ut med karakterer fra fonten
  // som viser avkryssingsboks med og uten kryss.
  return md.replaceAll(/<input[^>]*checked[^>]*>/g, '&#x2611;').replaceAll(/<input[^>]*>/g, '&#x2610;')
}
