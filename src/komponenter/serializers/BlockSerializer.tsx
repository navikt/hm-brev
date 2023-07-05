import React from 'react'
import { rightTrimLastProp } from '../../utils/rightTrim'

export function BlockSerializer(props: any) {
  const children = rightTrimLastProp(props)

  const Tag = settTag(props.value)

  return (
    <Tag style={{ minHeight: '1rem' }} className={'block'}>
      {children}
    </Tag>
  )
}

function settTag(node: any) {
  const style = node.style

  if (RegExp('/?h[1-6]').test(style)) {
    return style
  }

  return 'div'
}
