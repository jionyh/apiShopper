import { Request, Response } from "express";
import measureSchema from "../schemas/Measure";
import { CustomError, errorResponseHandler } from "../utils/errorHandler";
import measureService from "../services/Measure.service";


async function upload(req:Request, res:Response){
  const parse = measureSchema.upload.safeParse(req.body);
  if (!parse.success) return errorResponseHandler(res, parse.error.issues);
  const data = parse.data;

  try {
    const result = await measureService.createMeasure(data);
    return res.status(200).json(result);
  } catch (error) {
    if(error instanceof CustomError){
      return errorResponseHandler(res,error.code)
    }
    return errorResponseHandler(res)
  }
}

async function confirm(req:Request, res:Response){
  const parse = measureSchema.confirm.safeParse(req.body)
  if(!parse.success) return errorResponseHandler(res,parse.error.issues)
  const data = parse.data
  
  try {
    const result = await measureService.confirmMeasure(data);
    return res.status(200).json(result);
  } catch (error) {
    if(error instanceof CustomError){
      return errorResponseHandler(res,error.code)
    }
    return errorResponseHandler(res)
  }
}

async function list(req:Request, res:Response){
  const {customer_code} = req.params
  const {measure_type} = req.query
  try {
    const result = await measureService.listMeasures(customer_code, measure_type as string);
    return res.status(200).json(result);
  } catch (error) {
    if(error instanceof CustomError){
      return errorResponseHandler(res,error.code)
    }
    return errorResponseHandler(res)
  }
}

const measureController = {
  upload,
  confirm,
  list
}

export default measureController