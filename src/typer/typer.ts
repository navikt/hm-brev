import type { Maalform } from "./sanityGrensesnitt";

export type Begrunnelser = string[]

export interface IStandardbegrunnelsedata {
    apiNavn: string;
    gjelderSoker: boolean;
    barnasFodselsdatoer: string;
    fodselsdatoerBarnOppfyllerTriggereOgHarUtbetaling: string;
    fodselsdatoerBarnOppfyllerTriggereOgHarNullutbetaling: string;
    antallBarn: number;
    antallBarnOppfyllerTriggereOgHarUtbetaling: number;
    antallBarnOppfyllerTriggereOgHarNullutbetaling: number;
    maanedOgAarBegrunnelsenGjelderFor: string;
    maalform: Maalform;
    soknadstidspunkt: string;
    avtaletidspunktDeltBosted: string;
    belop: string;
  }

  export interface BegrunnelseBlock {
    _type: string;
    children: (SpanBlock | FlettefeltBlock)[];
  }

  export interface SpanBlock {
    _type: 'span';
    text: string;
  }
  
  export interface FlettefeltBlock {
    _type: 'flettefelt';
    flettefelt: string;
  }