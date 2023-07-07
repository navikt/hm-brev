export interface DokumentData {
  flettefelter: Flettefelter
  betingelser?: Betingelser
  begrunnelser?: Begrunnelser
}

export type Flettefelt = string

export type Flettefelter = Record<string, Flettefelt>

export type Betingelser = Record<string, boolean>

export type Begrunnelser = string[]
