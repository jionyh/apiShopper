import {Router} from 'express'
import measureController from '../controllers/Measure.controller'

const measureRouter = Router()

measureRouter.post('/upload', measureController.upload )
measureRouter.patch('/confirm', measureController.confirm)
measureRouter.get('/:customer_code/list', measureController.list)

export default measureRouter