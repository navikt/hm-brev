const { NODE_ENV } = process.env

export interface IMiljøvariabler {
  PDF_GENERATOR_API_URL: string
}

export const hentMiljøvariabler = (): IMiljøvariabler => {
  switch (NODE_ENV) {
    case 'production':
      return {
        PDF_GENERATOR_API_URL: 'http://hm-pdf-generator',
      }
    default:
      return {
        PDF_GENERATOR_API_URL: 'http://localhost:8082',
      }
  }
}
