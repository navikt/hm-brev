import express from 'express'
import { hentDokumentHtml } from './hentDokumentHtml'
import { genererPdf } from './pdf'
import type { Datasett } from './sanity/sanityClient'
import { client } from './sanity/sanityClient'
import type { IDokumentData } from './typer/dokumentApi'
import { Målform } from './typer/sanityGrensesnitt'
import { Feil } from './utils/Feil'
import { logError, logInfo } from './utils/logging'
import { validerDokumentApiData } from './utils/valideringer/validerDokumentApiData'

const router = express.Router()

router.get('/status', (_, res) => {
  res.status(200).end()
})

router.get<string, { datasett: Datasett; maalform: Målform; dokumentApiNavn: string }>(
  '/:datasett/dokument/:dokumentApiNavn/:maalform/test',
  async (req, res) => {
    const { datasett, maalform, dokumentApiNavn } = req.params

    try {
      const query = `*[_type == "dokument" && apiNavn == "${dokumentApiNavn}" ][].tittel${
        maalform == Målform.NB ? 'Bokmaal' : 'Nynorsk'
      }`

      logInfo(`Hent dokument query ${query}`)
      const svar = await client(datasett).fetch(query)

      return res.status(200).send(svar)
    } catch (feil: any) {
      return res.status(500).send(feil)
    }
  },
)

router.post<string, { datasett: Datasett; maalform: Målform; dokumentApiNavn: string }, any, IDokumentData>(
  '/:datasett/dokument/:dokumentApiNavn/:maalform/html',
  async (req, res) => {
    const { datasett, maalform, dokumentApiNavn } = req.params

    const dokument = req.body

    try {
      await validerDokumentApiData(datasett, maalform)
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett)
      res.send(html)
    } catch (feil: any) {
      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message)
      }

      logError(`Generering av html dokument feilet: ${feil.message}`)
      return res.status(500).send(`Generering av html dokument feilet: ${feil.message}`)
    }
  },
)

router.post<string, { datasett: Datasett; maalform: Målform; dokumentApiNavn: string }, any, IDokumentData>(
  '/:datasett/dokument/:dokumentApiNavn/:maalform/pdf',
  async (req, res) => {
    const { datasett, maalform, dokumentApiNavn } = req.params

    const dokument = req.body

    try {
      await validerDokumentApiData(datasett, maalform)
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett)
      const pdf = await genererPdf(html)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; file=${dokumentApiNavn}.pdf`)
      res.end(pdf)
    } catch (feil: any) {
      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message)
      }

      logError(`Generering av PDF-dokument feilet: ${feil.message}`)
      return res.status(500).send(`Generering av PDF-dokument feilet: ${feil.message}`)
    }
  },
)

export { router as routes }
