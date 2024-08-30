import express from 'express'
import dotenv from 'dotenv'
import router from './routes/Index'
import path from 'path'
import {config} from './config'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(router)

app.listen(config.port, ()=>{
  console.log(`API running on address: ${config.baseUrl}:${config.port}`)
})