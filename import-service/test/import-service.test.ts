import { APIGatewayProxyEvent, S3Event, S3EventRecord } from "aws-lambda";
import { handler as importProductsFile } from "../handlers/importProductsFile";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { handler as importFileParser } from "../handlers/importFileParser";
import { S3Client } from "@aws-sdk/client-s3";

const fs = require('fs')
jest.mock('@aws-sdk/s3-request-presigner')
jest.mock('@aws-sdk/client-s3');

describe('import-service tests', () => {
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
    describe('importFileParser tests', () => {
        test('print succes message when provided with csv file', async () => {
            jest.mocked(S3Client.prototype.send).mockImplementation(() => ({
                Body:  fs.createReadStream('test/mocks/example.csv')
            }))
            const logSpy = jest.spyOn(global.console, 'log');
            const fakes3Event: Partial<S3EventRecord> = {
                s3: {
                    s3SchemaVersion: '',
                    configurationId: '',
                    bucket: {
                        name: '',
                        ownerIdentity: {
                            principalId: ''
                        },
                        arn: ''
                    },
                    object: {
                        key: 'uploaded/file.csv',
                        size: 0,
                        eTag: '',
                        sequencer: ''
                    }
                }
            }
            const fakeEvent: Partial<S3Event> = {
                Records: [fakes3Event as S3EventRecord]
            }
            await importFileParser(fakeEvent as S3Event);
            expect(logSpy.mock.calls[0][0]).toContain('>>>>> S3 Trigger Success: ');
        })
        test('throws an error when providing broken csv file', async () => {
            jest.mocked(S3Client.prototype.send).mockImplementation(() => ({
                Body:  {}
            }))
            console.error = jest.fn();
            const fakes3Event: Partial<S3EventRecord> = {
                s3: {
                    s3SchemaVersion: '',
                    configurationId: '',
                    bucket: {
                        name: '',
                        ownerIdentity: {
                            principalId: ''
                        },
                        arn: ''
                    },
                    object: {
                        key: 'uploaded/file.csv',
                        size: 0,
                        eTag: '',
                        sequencer: ''
                    }
                }
            }
            const fakeEvent: Partial<S3Event> = {
                Records: [fakes3Event as S3EventRecord]
            }
            await importFileParser(fakeEvent as S3Event);
            expect(console.error).toHaveBeenCalled();
        })
    })
})
