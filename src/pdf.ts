import axios, { AxiosResponse } from "axios"
import { Feil } from "./utils/Feil"
import { logInfo } from "./utils/logging"

export const genererPdf = async(html: string): Promise<ArrayBuffer>  => {
    //const url = `${hentMiljøvariabler().HM_BREV_API_URL}/api/html-til-pdf`
    const url = `http://localhost:8082/api/html-til-pdf`

    logInfo(`Genererer pdf mot ${url}`)
    //logInfo(html)
    

    return axios.post(url, html, {
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'text/html',
            Accept: 'application:pdf',
        },

    }).then((res: AxiosResponse<ArrayBuffer>) => res.data).catch(error => {
        logInfo(error)
        throw new Feil(`Feil mot hm-brev-dokument`, 500, error)
    })
}


// sjekk om status tjeneste finnes 
// alternativ til Axios? 
// Se på den generisk PDF konverteren. Kan kanskje også brukes for søknaden?
