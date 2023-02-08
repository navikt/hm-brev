import type { Request, Response } from 'express'
import { client, Datasett } from './sanity/sanityClient'
import { Maalform } from './typer/sanityGrensesnitt'
import type { IDokumentData } from './typer/dokumentApi'
import validerDokumentApiData from './utils/valideringer/validerDokumentApiData'
import { Feil } from './utils/Feil'
import hentDokumentHtml from './hentDokumentHtml'
import express from 'express'
import { logError, logInfo } from './utils/logging'
import { genererPdf } from './pdf'

const router = express.Router()

router.get('/status', (_, res) => {
  res.status(200).end()
})

router.get(
  '/:datasett/dokument/:dokumentApiNavn/:maalform/test',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett
    const maalform = req.params.maalform as Maalform
    const dokumentApiNavn = req.params.dokumentApiNavn

    try {
      const query = `*[_type == "dokument" && apiNavn == "${dokumentApiNavn}" ][].tittel${
        maalform == Maalform.NB ? 'Bokmaal' : 'Nynorsk'
      }`

      logInfo(`Hent dokument query ${query}`)
      const svar = await client(datasett).fetch(query)

      return res.status(200).send(svar)
    } catch (feil: any) {
      return res.status(500).send(feil)
    }
  },
)

router.post(
  '/:datasett/dokument/:dokumentApiNavn/:maalform/html',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett
    const maalform = req.params.maalform as Maalform
    const dokumentApiNavn = req.params.dokumentApiNavn

    const dokument: IDokumentData = req.body as IDokumentData

    try {
      await validerDokumentApiData(datasett, maalform)
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett)
      logInfo(html)
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

router.post(
  '/:datasett/dokument/:dokumentApiNavn/:maalform/pdf',
  async (req: Request, res: Response) => {
    const datasett = req.params.datasett as Datasett
    const maalform = req.params.maalform as Maalform
    const dokumentApiNavn = req.params.dokumentApiNavn

    const dokument: IDokumentData = req.body as IDokumentData
    // logGenereringsrequestTilSecurelogger<IDokumentData>(datasett, dokumentApiNavn, dokument, req);

    try {
      await validerDokumentApiData(datasett, maalform)
      const html = await hentDokumentHtml(dokument, maalform, dokumentApiNavn, datasett)
      const pdf = await genererPdf(html)
      logInfo(`pdf ${pdf}`)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; file=${dokumentApiNavn}.pdf`)
      res.end(pdf)
    } catch (feil: any) {
      if (feil instanceof Feil) {
        return res.status(feil.code).send(feil.message)
      }

      logError(`Generering av pdf dokument feilet: ${feil.message} `)
      return res.status(500).send(`Generering av pdf dokument feilet: ${feil.message}`)
    }
  },
)

export default router
