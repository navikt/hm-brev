import { createClient } from '@sanity/client'

export enum Datasett {
  HOTSAK_BREV_PROD = 'hotsak-brev-prod',
}

export function client(dataset: Datasett) {
  return createClient({
    projectId: 'ypyqai5p',
    dataset,
    useCdn: process.env.NODE_ENV === 'production',
    apiVersion: '2021-06-07',
  })
}
