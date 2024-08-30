import { Router, Request, Response } from "express";
import measureRouter from "./Measure.routes";

const router = Router()

router.get('/test', (req:Request,res: Response)=>{
  res.status(200).json({message: 'ok'})
})

router.use('/', measureRouter)

router.get("*", (req:Request,res:Response) => {
  res.status(404).json({ message: "Endpoint Not Found" });
});

export default router