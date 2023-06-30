import express from 'express'
import path from 'path'
import routes from './routes'
import { logInfo } from './utils/logging'

export const { NODE_ENV } = process.env

const buildDir = path.join(`process.cwd()/public`)
const app = express()

if (NODE_ENV === 'production') {
  app.use(express.static(buildDir))
}

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

const port = 8001

app.listen(port, () => {
  logInfo(`Server now listening on port: ${port}. NODE_ENV: ${NODE_ENV}`)
})
