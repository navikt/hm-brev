import * as React from 'react'
import { client, Datasett } from './sanity/sanityClient'
import type { IDokumentData } from './typer/dokumentApi'
import { renderToStaticMarkup } from 'react-dom/server'
import { Maalform } from './typer/sanityGrensesnitt'
import { Feil } from './utils/Feil'
import Context from './utils/Context'
import css from './styles/css'
import Header from './komponenter/Header'
import Dokument from './komponenter/Dokument'

const hentDokumentHtml = async (
  apiDokument: IDokumentData,
  maalform: Maalform,
  dokumentApiNavn: string,
  datasett: Datasett,
): Promise<string> => {
  const query = `*[_type == "dokument" && apiNavn == "${dokumentApiNavn}" ][].tittel${
    maalform == Maalform.NB ? 'Bokmaal' : 'Nynorsk'
  }`

  const htmlLang = () => {
    return maalform === Maalform.NB ? 'nb' : 'nn'
  }

  const [tittel] = await client(datasett).fetch(query)

  if (!tittel) {
    throw new Feil(
      `Fant ikke ${maalform}-tittel til "${dokumentApiNavn}" i datasettet "${datasett}`,
      404,
    )
  }

  const contextValue = { requests: [] }

  const asyncHtml = () => (
    <Context.Provider value={contextValue}>
      <html lang={htmlLang()}>
        <head>
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <style type="text/css">{css}</style>
          <title>{tittel}</title>
        </head>
        <body className={'body'}>
          <div>
            <Header
              visLogo={true}
              tittel={tittel}
              brevOpprettetDato={
                apiDokument?.flettefelter?.brevOpprettetDato || apiDokument?.flettefelter?.dato
              }
            />
            
            <Dokument
              dokumentApiNavn={dokumentApiNavn}
              dokumentData={apiDokument}
              maalform={maalform}
              datasett={datasett}
            />
          </div>
        </body>
      </html>
    </Context.Provider>
  )

  async function byggDokumentAsynkront() {
    const html = renderToStaticMarkup(asyncHtml())
    await Promise.all(contextValue.requests)
    return html
  }

  /* Følger denne guiden:
   * https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
   *
   * Resultatet fra eksterne kall blir lagret i konteksten slik at man kan bruke asynkrone funksjoner med serverside rendering.
   *
   * Når man kjører byggDokumentAsynkront flere ganger vil dokumentene og underdokumentene til alt er hentet fra Sanity.
   */
  let i = 0
  let dokument = await byggDokumentAsynkront()
  while (dokument !== (await byggDokumentAsynkront())) {
    if (i++ >= 100) {
      throw new Error('Dokumentet har en dybde på mer enn 100')
    }
    dokument = await byggDokumentAsynkront()
  }

  dokument = dokument.replace(/&#x27;/g, "'")
  return dokument.replace(/(\r\n|\n|\r)/gm, '')
}

export default hentDokumentHtml
