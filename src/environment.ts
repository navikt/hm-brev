export interface IMiljøvariabler {
  PDF_GENERATOR_API_URL: string
}

export function hentMiljøvariabler(): IMiljøvariabler {
  switch (process.env.NODE_ENV) {
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
