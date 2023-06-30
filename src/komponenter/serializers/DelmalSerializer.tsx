import { PortableText } from '@portabletext/react'
import React from 'react'
import type { IDelmalData } from '../../typer/dokumentApi'
import type { Maalform } from '../../typer/sanityGrensesnitt'
import BlockSerializer from './BlockSerializer'

interface IDelmalSerializerProps {
  sanityProps: any
  delmalData: IDelmalData | undefined
  maalform: Maalform
}

const DelmalSerializer = (props: IDelmalSerializerProps) => {
  const { sanityProps, maalform } = props
  const { delmalReferanse } = sanityProps.value

  // TODO Flettefelt i delmaler er ikke støttet enda

  return (
    <div className="delmal">
      <PortableText
        value={delmalReferanse[maalform]}
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

export default DelmalSerializer
