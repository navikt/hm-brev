import { Datasett } from '../../sanity/sanityClient'
import { Målform } from '../../typer/sanityGrensesnitt'
import { Feil } from '../Feil'

export async function validerDokumentApiData(datasett: Datasett, målform: Målform) {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new Feil(`Datasettet "${datasett}" finnes ikke`, 404)
  }

  if (!Object.values(Målform).includes(målform)) {
    throw new Feil(`Målformen "${målform}" finnes ikke.`, 404)
  }
}
