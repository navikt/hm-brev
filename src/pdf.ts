import axios from 'axios'
import { hentMiljøvariabler } from './environment'
import { Feil } from './utils/Feil'
import { logInfo } from './utils/logging'

export async function genererPdf(html: string): Promise<ArrayBuffer> {
  const url = `${hentMiljøvariabler().PDF_GENERATOR_API_URL}/api/html-til-pdf`

  logInfo(`Genererer pdf mot ${url}`)

  try {
    const response = await axios.post<any, any, string>(url, html, {
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/pdf',
        'Content-Type': 'text/html',
      },
    })
    return response.data
  } catch (e: any) {
    throw new Feil('Feil mot hm-pdf-generator', 500, e)
  }
}

// TODO: alternativ til Axios?
