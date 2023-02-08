import { Feil } from "../../utils/Feil";

export interface FlettefeltBlock {
    _type: 'flettefelt';
    flettefelt: string;
  }

const FlettefeltSerializer = (props: any) =>{
    const {sanityProps, flettefelter, dokumentApiNavn} = props 
    const {flettefelt} = sanityProps.value

    const flettefeltVerdi = flettefelter[flettefelt]

    if(flettefeltVerdi === undefined || flettefeltVerdi === '') {
        throw new Feil(`Flettefeltet "${flettefelt}" mangler for ${dokumentApiNavn}`, 400)
    }

    return flettefeltVerdi
}

export default FlettefeltSerializer