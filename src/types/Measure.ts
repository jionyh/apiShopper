export interface CreateMeasureData {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

export interface CreateMeasureResponse{
  image_url: string
  measure_value: number
  measure_uuid:string
}

export interface ConfirmMeasureData {
  measure_uuid: string;
  confirmed_value: number;
}

export interface ConfirmMeasureResponse{
  success:true
}

export interface ListMeasureResponse{
  customer_code:string
  measures: MeasureList[]
}

interface MeasureList{
  measure_uuid: string
  measure_datetime: Date
  measure_type:string
  has_confirmed: boolean
  image_url: string
}
