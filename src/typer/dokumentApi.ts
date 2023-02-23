import type { Begrunnelser } from "./typer";

export interface IDokumentData {
    delmalData: IDelmalData
    flettefelter: Flettefelter 
    begrunnelser: Begrunnelser
}

export interface IDelmalData {
    [key: string]: Flettefelter
}

export type Flettefelter = {[key: string]: Flettefelt}

export type Flettefelt = string
