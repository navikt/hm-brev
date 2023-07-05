import express from 'express'
import path from 'path'
import { routes } from './routes'
import { logInfo } from './utils/logging'

const buildDir = path.join(process.cwd(), 'public')
const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(buildDir))
}

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

const port = process.env.PORT || 8001

app.listen(port, () => {
  logInfo(`Lytter på port: ${port}, NODE_ENV: ${process.env.NODE_ENV}`)
})
