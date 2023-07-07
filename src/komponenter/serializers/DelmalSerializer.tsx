import type { PortableTextTypeComponentProps } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import React from 'react'
import type { Målform } from '../../typer/sanityGrensesnitt'
import { BlockSerializer } from './BlockSerializer'

export interface DelmalSerializerProps extends PortableTextTypeComponentProps<{ delmalReferanse: any }> {
  målform: Målform
}

export function DelmalSerializer(props: DelmalSerializerProps) {
  const { value, målform } = props
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
          },
        }}
      />
    </div>
  )
}
