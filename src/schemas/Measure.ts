import {z} from 'zod'

const upload = z.object({
  image: z.string({message:'O campo image é obrigatório'}).base64({message:'A imagem enviada não está em formato base64'}),
  customer_code: z.string({message:'O campo customer_code é obrigatório'}),
  measure_datetime: z.string({message: 'O campo measure_datetime é obrigatório'}).datetime({message: 'O campo measure_datetime é inválido'}),
  measure_type: z.enum(['WATER', 'GAS'], {message:'O campo measure_type aceita valores WATER ou GAS'})
})

const confirm = z.object({
  measure_uuid: z.string({message:'O campo measure_uuid é obrigatório'}).uuid({message:'O campo measure_uuid é inválido'}),
  confirmed_value: z.number({ message: 'O campo confirmed_value deve ser um número e é obrigatório.' }).min(0, { message: 'O campo confirmed_value deve ter um valor positivo.' })
})

const measureSchema = {
  upload, confirm
}

export default measureSchema