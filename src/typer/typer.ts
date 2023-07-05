export type Begrunnelser = string[]

export interface BegrunnelseBlock {
  _type: string
  children: (SpanBlock | FlettefeltBlock)[]
}

export interface SpanBlock {
  _type: 'span'
  text: string
}

export interface FlettefeltBlock {
  _type: 'flettefelt'
  flettefelt: string
}
