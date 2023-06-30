import { createClient } from '@sanity/client'

export enum Datasett {
  HOTSAK_BREV_PROD = 'hotsak-brev-prod',
  HOTSAK_BREV_DEV = 'hotsak-brev-dev',
}

export const client = (dataset: Datasett) => {
  return createClient({
    projectId: 'ypyqai5p',
    dataset,
    useCdn: process.env.NODE_ENV === 'production',
    apiVersion: '2021-06-07',
  })
}
