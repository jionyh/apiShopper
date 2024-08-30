export const measureResponseMock = {
customer_code: "010203",
    measures: [
        {
            measure_uuid: "7cb20c93-3dc7-4b37-a26d-ea2dde9f680b",
            measure_datetime: new Date("2024-08-01T03:59:00.000Z"),
            measure_type: "WATER",
            has_confirmed: true,
            image_url: "http://localhost:3000/public/7cb20c93-3dc7-4b37-a26d-ea2dde9f680b.jpg"
        },
        {
            measure_uuid: "7cb20c93-3dc7-4b37-a26d-ea2dde9f680b",
            measure_datetime: new Date("2024-08-01T03:59:00.000Z"),
            measure_type: "GAS",
            has_confirmed: false,
            image_url: "http://localhost:3000/public/7cb20c93-3dc7-4b37-a26d-ea2dde9f680b.jpg"
        }
    ]
}