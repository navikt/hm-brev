import sanityClient from '@sanity/client'
import { NODE_ENV } from '..'

export enum Datasett {
  HOTSAK_BREV_PROD = 'hotsak-brev-prod',
  HOTSAK_BREV_DEV = 'hotsak-brev-dev',
}

export const client = (dataset: Datasett) => {
  return sanityClient({
    projectId: 'ypyqai5p',
    dataset,
    useCdn: NODE_ENV === 'production',
    apiVersion: '2021-06-07',
  })
}
