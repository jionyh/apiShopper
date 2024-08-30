import { GoogleGenerativeAI } from '@google/generative-ai'
import {config} from '../config'

const readImageValue = async(image64:string)=>{
  const genAi = new GoogleGenerativeAI(config.geminiApiKey as string)
  const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" })
  const prompt = "Qual o valor da leitura exata apenas do display? Remova os zero à esquerda e responda apenas com números"
  const content = await model.generateContent([prompt,{
  inlineData:{
    data: image64,
    mimeType: 'image/jpg'
  }
}])

return parseFloat(content.response.text())
}

export default readImageValue