import { measure } from "@prisma/client"

export const measureEntityMock: measure = {
    id: 1,
    guid: '7cb20c93-3dc7-4b37-a26d-ea2dde9f680b',
    customer_code: '010203',
    type: 'WATER',
    value: 2273,
    date: new Date('2024-08-01T03:59:00.000Z'),
    confirmed: true,
    createdAt: new Date('2024-08-29T14:05:01.924Z'),
    updatedAt: new Date('2024-08-29T14:05:01.924Z')
}

export const measureEntitiesMock:measure[] = [
  {...measureEntityMock},
  {...measureEntityMock, type: 'GAS', value:150, confirmed: false},
  {...measureEntityMock, customer_code: '040506', value:100},
  {...measureEntityMock, customer_code: '040506', type: 'GAS',confirmed: false},
  {...measureEntityMock, customer_code: '1234', type: 'WATER', value:200, date: new Date('2024-09-01T00:00:01.000Z'), confirmed: false},
]