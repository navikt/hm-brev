export interface IDokumentData {
    delmalData: IDelmalData
    flettefelter: Flettefelter 
}

export interface IDelmalData {
    [key: string]: Flettefelter
}

export type Flettefelter = {[key: string]: Flettefelt}

export type Flettefelt = string
