import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { hentMiljøvariabler } from './environment'
import { Feil } from './utils/Feil'
import { logInfo } from './utils/logging'

export const genererPdf = async (html: string): Promise<ArrayBuffer> => {
  const url = `${hentMiljøvariabler().PDF_GENERATOR_API_URL}/api/html-til-pdf`

  logInfo(`Genererer pdf mot ${url}`)

  return axios
    .post(url, html, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'text/html',
        Accept: 'application:pdf',
      },
    })
    .then((res: AxiosResponse<ArrayBuffer>) => res.data)
    .catch(error => {
      logInfo(error)
      throw new Feil(`Feil mot hm-brev-dokument`, 500, error)
    })
}

// TODO: alternativ til Axios?
