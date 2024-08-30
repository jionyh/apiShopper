import { measureEntitiesMock } from './../__mocks__/measureEntity.mock';
import * as uuid from "../../libs/crypto"
import * as gemini from "../../libs/gemini"
import * as fileHandler from "../../utils/fileHandler"
import { prismaMock } from "../../singleton"
import { createMeasureMock } from "../__mocks__/measureCreate.mock"
import { measureEntityMock } from "../__mocks__/measureEntity.mock"
import measureService from "../Measure.service"
import { measureResponseMock } from '../__mocks__/measureResponse.mock';


describe('MeasureService', () => { 
  const mockProcessedValue = 12345;
  const mockGuid = '7cb20c93-3dc7-4b37-a26d-ea2dde9f680b';
  let geminiSpy: jest.SpyInstance;
  let uuidSpy: jest.SpyInstance;
  let fileHandlerSpy: jest.SpyInstance;
  let generateFileLinkSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    geminiSpy = jest.spyOn(gemini, 'default').mockResolvedValue(mockProcessedValue);
    uuidSpy = jest.spyOn(uuid, 'default').mockReturnValue(mockGuid);
    fileHandlerSpy = jest.spyOn(fileHandler, 'generateJpgFile').mockImplementation(jest.fn());
    generateFileLinkSpy = jest.spyOn(fileHandler, 'generateFileLink')
  });


  describe('Upload',()=>{
    it('Should throw DOUBLE_REPORT error if measure already exist',async()=>{
      prismaMock.measure.findFirst.mockResolvedValue(measureEntityMock)
      await expect(measureService.createMeasure(createMeasureMock)).rejects.toThrow('DOUBLE_REPORT');
    })
    it('Should create measure successful',async()=>{

      prismaMock.measure.findFirst.mockResolvedValue(null);
      prismaMock.measure.create.mockResolvedValue(measureEntityMock);
      geminiSpy.mockResolvedValue(mockProcessedValue);
      uuidSpy.mockReturnValue(mockGuid);
      fileHandlerSpy.mockImplementation(jest.fn())
      generateFileLinkSpy.mockImplementation((guid: string) => `http://localhost:3000/public/${guid}.jpg`)
    

      const result = await measureService.createMeasure(createMeasureMock);

      expect(prismaMock.measure.findFirst).toHaveBeenCalledWith({
        where: {
          customer_code: createMeasureMock.customer_code,
          type: createMeasureMock.measure_type,
          date: {
            gt: expect.any(Date),
            lt: expect.any(Date)
          }
        }
      })
      expect(geminiSpy).toHaveBeenCalledWith(createMeasureMock.image);
      expect(uuidSpy).toHaveBeenCalled();
      expect(fileHandlerSpy).toHaveBeenCalledWith(mockGuid, createMeasureMock.image);
      expect(generateFileLinkSpy).toHaveBeenCalledWith(mockGuid)

      expect(result).toEqual({
        image_url: `http://localhost:3000/public/${mockGuid}.jpg`,
        measure_value: mockProcessedValue,
        measure_uuid: mockGuid
      });
    })
  })

  describe('Confirm', () => {
    const confirmMock = {
      measure_uuid: "7cb20c93-3dc7-4b37-a26d-ea2dde9f680b",
      confirmed_value: 200
    }
    it('Should throw MEASURE_NOT_FOUND error if measure uuid not found',async()=>{
      prismaMock.measure.findFirst.mockResolvedValue(null)
      await expect(measureService.confirmMeasure(confirmMock)).rejects.toThrow('MEASURE_NOT_FOUND');
    })
    it('Should throw CONFIRMATION_DUPLICATE error if measure uuid found and already confirmed',async()=>{
      prismaMock.measure.findFirst.mockResolvedValue(measureEntityMock)
      await expect(measureService.confirmMeasure(confirmMock)).rejects.toThrow('CONFIRMATION_DUPLICATE');
    })
    it('Should confirm measure successful',async()=>{
      prismaMock.measure.findFirst.mockResolvedValue({...measureEntityMock, confirmed: false})
      prismaMock.measure.update.mockResolvedValue({...measureEntityMock, value: confirmMock.confirmed_value});    

      const result = await measureService.confirmMeasure(confirmMock);
      const findFirstResult = await prismaMock.measure.findFirst.mock.results[0].value

      expect(prismaMock.measure.findFirst).toHaveBeenCalledWith({
        where: {
          guid: confirmMock.measure_uuid
        }
      })
      expect(prismaMock.measure.update).toHaveBeenCalled()
      expect(findFirstResult).toHaveProperty('confirmed', false)
      expect(result).toEqual({success:true})

    })
  })

  describe('List', () => {
    const listMock = {
      customer_code: "010203",
      measure_type: 'WATER'
    }
    it('Should throw MEASURES_NOT_FOUND error if measures for customer_code not found',async()=>{
      prismaMock.measure.findMany.mockResolvedValue([])
      await expect(measureService.listMeasures(listMock.customer_code)).rejects.toThrow('MEASURES_NOT_FOUND');
    })
    it('Should throw INVALID_TYPE error if provided type is not WATER or GAS',async()=>{
      prismaMock.measure.findFirst.mockResolvedValue(measureEntityMock)
      await expect(measureService.listMeasures(listMock.customer_code, 'MOCK_TYPE')).rejects.toThrow('INVALID_TYPE');
    })
    it('Should list all measures for customer_code successfully',async()=>{
      const entitiesMockList = measureEntitiesMock.filter(measure => 
        measure.customer_code === listMock.customer_code
      )
      prismaMock.measure.findMany.mockResolvedValue(entitiesMockList)

      const result = await measureService.listMeasures(listMock.customer_code);

      expect(prismaMock.measure.findMany).toHaveBeenCalledWith({
        where: {
          customer_code: listMock.customer_code,
          type: undefined
        }
      })
      expect(result).toEqual(measureResponseMock)

    })
    it('Should list all measures for customer_code with type WATER',async()=>{
      const entitiesMockList = measureEntitiesMock.filter(measure => 
        measure.customer_code === listMock.customer_code && measure.type === listMock.measure_type
      )
      prismaMock.measure.findMany.mockResolvedValue(entitiesMockList)

      const result = await measureService.listMeasures(listMock.customer_code, listMock.measure_type);

      expect(prismaMock.measure.findMany).toHaveBeenCalledWith({
        where: {
          customer_code: listMock.customer_code,
          type: 'WATER'
        }
      })
      expect(result).toEqual({
        customer_code: listMock.customer_code,
        measures: new Array(measureResponseMock.measures[0])
      })

    })
  })
})