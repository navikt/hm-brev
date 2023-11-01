import express from 'express'
import { hentDokumentHtml } from './hentDokumentHtml'
import { genererPdf } from './pdf'
import type { Datasett } from './sanity/sanityClient'
import { client } from './sanity/sanityClient'
import type { DokumentData } from './typer/dokumentApi'
import { Målform } from './typer/sanityGrensesnitt'
import { Feil } from './utils/Feil'
import { logError, logInfo } from './utils/logging'
import { validerDokumentApiData } from './utils/valideringer/validerDokumentApiData'

const router = express.Router()

router.get('/status', (_, res) => {
  res.status(200).end()
})

router.get<string, { datasett: Datasett; malform: Målform; dokumentApiNavn: string }>(
  '/:datasett/dokument/:dokumentApiNavn/:malform/test',
  async (req, res) => {
    const { datasett, malform: målform, dokumentApiNavn } = req.params

    try {
      const query = `*[ _type == "dokument" && apiNavn == $dokumentApiNavn ].[$tittel]`

      logInfo(`Hent dokument med query: '${query}'`)
      const svar = await client(datasett).fetch(query, {
        dokumentApiNavn,
        tittel: målform == Målform.NB ? 'tittelBokmaal' : 'tittelNynorsk',
      })

      return res.status(200).send(svar)
    } catch (feil: any) {
      return res.status(500).send(feil)
    }
  },
)

interface LagBrevRequest {
  datasett: Datasett
  malform: Målform
  dokumentApiNavn: string
  sakId: string
}

router.post<string, LagBrevRequest, any, DokumentData>(
  '/:datasett/dokument/:dokumentApiNavn/:malform/html',
  async (req, res) => {
    const { datasett, malform: målform, dokumentApiNavn, sakId } = req.params

    const dokument = req.body

    try {
      await validerDokumentApiData(datasett, målform)
      const html = await hentDokumentHtml(dokument, målform, dokumentApiNavn, datasett, sakId)
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

router.post<string, LagBrevRequest, any, DokumentData>(
  '/:datasett/dokument/:dokumentApiNavn/:malform/pdf',
  async (req, res) => {
    const { datasett, malform: målform, dokumentApiNavn, sakId } = req.params

    const dokument = req.body

    try {
      await validerDokumentApiData(datasett, målform)
      const html = await hentDokumentHtml(dokument, målform, dokumentApiNavn, datasett, sakId)
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
