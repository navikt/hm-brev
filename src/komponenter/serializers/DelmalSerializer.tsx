import { PortableText } from '@portabletext/react'
import React from 'react'
import type { IDelmalData } from '../../typer/dokumentApi'
import type { Målform } from '../../typer/sanityGrensesnitt'
import { BlockSerializer } from './BlockSerializer'

export interface DelmalSerializerProps {
  sanityProps: any
  delmalData?: IDelmalData
  målform: Målform
}

export function DelmalSerializer(props: DelmalSerializerProps) {
  const { sanityProps, målform } = props
  const { delmalReferanse } = sanityProps.value

  // TODO Flettefelt i delmaler er ikke støttet enda

  return (
    <div className="delmal">
      <PortableText
        value={delmalReferanse[målform]}
        components={{
          block: BlockSerializer,
          types: {
            undefined: (_: any) => <div />,
          },
        }}
      />
    </div>
  )
}
