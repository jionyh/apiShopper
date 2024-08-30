import  prisma  from "../libs/prisma";
import  readImageValue  from "../libs/gemini";
import { generateJpgFile, generateFileLink } from "../utils/fileHandler";
import { startAndEndOfMonth } from "../utils/dateUtils";
import { ConfirmMeasureData, ConfirmMeasureResponse, CreateMeasureData, CreateMeasureResponse, ListMeasureResponse } from "../types/Measure";
import { CustomError } from "../utils/errorHandler";
import  generateUUID  from "../libs/crypto";


const createMeasure = async (data: CreateMeasureData): Promise<CreateMeasureResponse | CustomError> => {
  const { image, customer_code, measure_datetime, measure_type } = data;
  const { start, end } = startAndEndOfMonth(measure_datetime);

  const measureExists = await prisma.measure.findFirst({
    where: {
      customer_code,
      type: measure_type,
      date: {
        gt: start,
        lt: end
      }
    }
  });

  if (measureExists) {
    throw new CustomError('DOUBLE_REPORT')
  }

  const processedValue = await readImageValue(image);
  const guid = generateUUID()
  generateJpgFile(guid, image);
  await prisma.measure.create({
    data: {
      customer_code,
      date: measure_datetime,
      value: processedValue,
      type: measure_type,
      guid,
      confirmed: false
    }
  });

  return {
    image_url: generateFileLink(guid),
    measure_value: processedValue,
    measure_uuid: guid
  };
};

const confirmMeasure = async (data: ConfirmMeasureData):Promise<ConfirmMeasureResponse | CustomError> => {
  const { measure_uuid, confirmed_value } = data;

  const measureExists = await prisma.measure.findFirst({
    where: {
      guid: measure_uuid
    }
  });
  if (!measureExists) {
    throw new CustomError('MEASURE_NOT_FOUND');
  }
  if (measureExists.confirmed) {
    throw new CustomError('CONFIRMATION_DUPLICATE');
  }
  await prisma.measure.update({
    where: { guid: measure_uuid },
    data: { confirmed: true, value: confirmed_value }
  });
  return { success: true };
};

const listMeasures = async (customer_code: string, measure_type?: string):Promise<ListMeasureResponse | CustomError> => {
  let typeFilter = undefined;

  if (measure_type) {
    const validTypes = ['WATER', 'GAS'];
    const measureType = measure_type.toUpperCase();
    if (!validTypes.includes(measureType)) {
      throw new CustomError('INVALID_TYPE');
    }
    typeFilter = measureType;
  }

  const findMeasureList = await prisma.measure.findMany({
    where: {
      customer_code,
      type: typeFilter
    }
  });

  if (findMeasureList.length < 1) {
    throw new CustomError('MEASURES_NOT_FOUND');
  }

  return {
    customer_code,
    measures: findMeasureList.map(measure => ({
      measure_uuid: measure.guid,
      measure_datetime: measure.date,
      measure_type: measure.type,
      has_confirmed: measure.confirmed,
      image_url: generateFileLink(measure.guid)
    }))
  };
};


  const measureService = {
    createMeasure,
    confirmMeasure,
    listMeasures
  }

export default measureService