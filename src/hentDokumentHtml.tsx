import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Dokument } from './komponenter/Dokument'
import { Header } from './komponenter/Header'
import type { Datasett } from './sanity/sanityClient'
import { client } from './sanity/sanityClient'
import { styles } from './styles/styles'
import type { DokumentData } from './typer/dokumentApi'
import { Målform } from './typer/sanityGrensesnitt'
import { Context } from './utils/Context'
import { Feil } from './utils/Feil'

export async function hentDokumentHtml(
  apiDokument: DokumentData,
  målform: Målform,
  dokumentApiNavn: string,
  datasett: Datasett,
  sakId?: string,
): Promise<string> {
  const query = `*[ _type == "dokument" && apiNavn == $dokumentApiNavn ].[$tittel]`

  const htmlLang = () => {
    return målform === Målform.NB ? 'nb' : 'nn'
  }

  const [tittel] = await client(datasett).fetch<string[]>(query, {
    dokumentApiNavn,
    tittel: målform == Målform.NB ? 'tittelBokmaal' : 'tittelNynorsk',
  })

  if (!tittel) {
    throw new Feil(`Fant ikke ${målform}-tittel til "${dokumentApiNavn}" i datasettet "${datasett}"`, 404)
  }

  const contextValue = { requests: [] }

  const asyncHtml = () => {
    const bunntekst = sakId ? `Saksnummer ${sakId}` : ''
    return (
      <Context.Provider value={contextValue}>
        <html lang={htmlLang()}>
          <style>
            {`
                    @page {
                        @bottom-right {
                            content: 'Side ' counter(page) ' av ' counter(pages);
                        }
                        @bottom-left {
                            content: '${bunntekst}';
                        }
                    }
                    `}
          </style>
          <head>
            <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
            <style type="text/css">{styles}</style>
            <title>{tittel}</title>
          </head>
          <body className={'body'}>
            <div>
              <Header
                visLogo={true}
                tittel={tittel}
                brevOpprettetDato={apiDokument?.flettefelter?.brevOpprettetDato || apiDokument?.flettefelter?.dato}
              />
              <Dokument
                dokumentApiNavn={dokumentApiNavn}
                dokumentData={apiDokument}
                målform={målform}
                datasett={datasett}
              />
            </div>
          </body>
        </html>
      </Context.Provider>
    )
  }

  const byggDokumentAsynkront = async () => {
    const html = renderToStaticMarkup(asyncHtml())
    await Promise.all(contextValue.requests)
    return html
  }

  /*
   * Følger denne guiden:
   * https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
   *
   * Resultatet fra eksterne kall blir lagret i konteksten slik at man kan bruke asynkrone funksjoner med server side rendering.
   *
   * Når man kjører byggDokumentAsynkront flere ganger vil dokumentene og underdokumentene bli lagret til alt er hentet fra Sanity.
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
