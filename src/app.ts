import express, {Application} from "express"
import {config} from './config'

const app: Application = express()
app.use(express.json());

import documentTextRoute from './routes/documentText'
app.use(documentTextRoute)

app.listen(config.port, () => {
    console.log(`Server started on port: ${config.port}`)
})