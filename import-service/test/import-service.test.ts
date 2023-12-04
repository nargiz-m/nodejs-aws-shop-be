import { APIGatewayProxyEvent } from "aws-lambda";
import { handler as importProductsFile } from "../handlers/importProductsFile";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { handler as importFileParser } from "../handlers/importFileParser";

jest.mock('@aws-sdk/s3-request-presigner')

describe('importProductsFile tests', () => {
    test('returns error when no name provided in queryParams', async () => {
        const fakeEvent: Partial<APIGatewayProxyEvent> = {}
        const response = await importProductsFile(fakeEvent as APIGatewayProxyEvent);

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual('File name is missing');
    })
    test('returns error when provided with wrong file extension in queryParams', async () => {
        const fakeEvent: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {
                name: 'file.pdf'
            }
        }
        const response = await importProductsFile(fakeEvent as APIGatewayProxyEvent);

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual('Wrong file format');
    })
    test('provides url when provided with csv file name', async () => {
        jest.mocked(getSignedUrl).mockImplementation(() => Promise.resolve('http://fakeUrl.com/uploaded/file.csv'))
        const fakeEvent: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {
                name: 'file.csv'
            }
        }
        const response = await importProductsFile(fakeEvent as APIGatewayProxyEvent);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeTruthy();
    })
});
