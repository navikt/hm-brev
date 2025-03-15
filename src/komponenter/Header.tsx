import React from 'react'
import { NavIkon } from '../ikoner/NavIkon'
import type { Flettefelt } from '../typer/dokumentApi'
import { Feil } from '../utils/Feil'

export interface HeaderProps {
  tittel: string
  brevOpprettetDato: Flettefelt
  visLogo?: boolean
}

export function Header(props: HeaderProps) {
  const { tittel, brevOpprettetDato, visLogo } = props

  if (brevOpprettetDato === undefined || brevOpprettetDato === '') {
    throw new Feil(
      `Mangler dato for brevet som skal vises i headeren. Sendes inn som "brevOpprettetDato" eller "dato" i flettefelter-objektet.`,
      400,
    )
  }

  return (
    <div className="header">
      <div className="ikon-og-dato">
        {visLogo && <NavIkon />}
        <p>{brevOpprettetDato}</p>
      </div>
      <div className="tittel-og-personinfo">
        <h2 className="tittel">{tittel}</h2>
      </div>
    </div>
  )
}
