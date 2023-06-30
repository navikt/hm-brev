import { Datasett } from '../../sanity/sanityClient'
import { Målform } from '../../typer/sanityGrensesnitt'
import { Feil } from '../Feil'

export default async (datasett: Datasett, maalform: Målform) => {
  if (!Object.values(Datasett).includes(datasett)) {
    throw new Feil(`Datasettet "${datasett}" finnes ikke`, 404)
  }

  if (!Object.values(Målform).includes(maalform)) {
    throw new Feil(`Målformen "${maalform}" finnes ikke.`, 404)
  }
}
