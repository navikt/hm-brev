import type { PortableTextComponentProps } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import React from 'react'
import { rightTrimLastProp } from '../../utils/rightTrim'

export function BlockSerializer(props: PortableTextComponentProps<PortableTextBlock>) {
  const children = rightTrimLastProp(props)

  const Tag = settTag(props.value)

  return (
    <Tag style={{ minHeight: '1rem' }} className={'block'}>
      {children}
    </Tag>
  )
}

// fixme -> bytt til riktig type i return
function settTag(node: PortableTextBlock): any {
  const style = node.style

  if (style && RegExp('/?h[1-6]').test(style)) {
    return style
  }

  return 'div'
}
