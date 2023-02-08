import React from 'react'
import type { Flettefelt } from '../typer/dokumentApi'
import { NavIkon } from '../ikoner/navIkon';

interface HeaderProps {
    tittel: string
    brevOpprettetDato: Flettefelt 
    visLogo?: boolean
}

function Header(props: HeaderProps) {
    const {tittel, brevOpprettetDato, visLogo} = props 

    return (
        <div className='header'>
            <div className='ikon-og-dato'>
                {visLogo && <NavIkon/>}
                <p>{brevOpprettetDato}</p>
            </div>
            <div className='tittel-og-personinfo'>
                <h2 className='tittel'>{tittel}</h2>
            </div>
        </div>
    )
}

export default Header