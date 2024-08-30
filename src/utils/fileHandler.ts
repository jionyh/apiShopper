import { writeFileSync } from "fs";
import path from "path"
import {config} from '../config'


export const generateFileLink = (measureGuid:string)=>{

  return `${config.baseUrl}:${config.port}/public/${measureGuid}.jpg`
}

export const generateJpgFile = (measureGuid:string, image:string)=>{
  const imageFile = Buffer.from(image,'base64')
  const tempDir = path.join(__dirname, "../../public");
  const fileName = `${measureGuid}.jpg`
  const filePath = path.join(tempDir,fileName)
  writeFileSync(filePath, imageFile)
}