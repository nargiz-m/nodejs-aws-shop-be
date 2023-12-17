import { APIGatewayProxyEvent, SQSEvent, SQSRecord } from "aws-lambda";
import { handler as getProductsById } from "../handlers/getProductsById";
import { handler as getProductsList } from "../handlers/getProductsList";
import { handler as catalogBatchProcess } from "../handlers/catalogBatchProcess";
import { getProductsWithStocks } from "../services/getProductsWithStocks";
import { getSingleProduct } from "../services/getSingleProduct";
import { postNewProduct } from "../services/postNewProduct";
import productMocks from "./mocks/product-mocks";
import { SNSClient } from "@aws-sdk/client-sns";

jest.mock('../services/getProductsWithStocks')
jest.mock('../services/getSingleProduct')
jest.mock('../services/postNewProduct')
jest.mock('@aws-sdk/client-sns');

describe('Product Service unit tests', () => {
  test("getProductsList returns list of products", async () => {
    jest.mocked(getProductsWithStocks).mockImplementation(() => Promise.resolve([...productMocks]))
    const productsResponse = await getProductsList();

    expect(productsResponse.statusCode).toEqual(200);
    expect(JSON.parse(productsResponse.body).length).toBeGreaterThan(0);
  }) 
  
  test("getProductsById returns a product information when sending correct id", async () => {
    jest.mocked(getSingleProduct).mockImplementation(() => Promise.resolve(productMocks[0]))
    const fakeEvent: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        product_id: productMocks[0].id
      }
    }
    const productResponse = await getProductsById(fakeEvent as APIGatewayProxyEvent);

    expect(productResponse.statusCode).toEqual(200);
    expect(JSON.parse(productResponse.body).id).toEqual(fakeEvent.pathParameters?.product_id);
    expect(JSON.parse(productResponse.body).title).toBeTruthy();
    expect(typeof JSON.parse(productResponse.body).title).toBe('string');
  }) 

  test("getProductsById returns an error page when sending incorrect id", async () => {
    jest.mocked(getSingleProduct).mockImplementation(() => Promise.resolve(undefined))
    const fakeEvent: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        product_id: 'random'
      }
    }
    const productResponse = await getProductsById(fakeEvent as APIGatewayProxyEvent);

    expect(productResponse.statusCode).toEqual(404);
    expect(productResponse.body).toEqual('Product not found');
  })

  describe('catalogBatchProcess unit tests', () => {
    test('logs created product id when provided with correct body', async () => {
      jest.mocked(postNewProduct).mockImplementation(() => Promise.resolve(productMocks[0].id))
      console.log = jest.fn();
      jest.mocked(SNSClient.prototype.send).mockImplementation(() => ({
        Body:  {}
      }))
      const {id, ...productBody} = productMocks[0]
      const fakeBody: Partial<SQSRecord> = {
        body: JSON.stringify(productBody)
      }
      const fakeEvent: Partial<SQSEvent> = {
        Records: [fakeBody as SQSRecord]
      }

      await catalogBatchProcess(fakeEvent as SQSEvent);
      expect(console.log).toHaveBeenCalledTimes(3);
      expect(console.log).toHaveBeenCalledWith('Catalog batch process started');
      expect(console.log).toHaveBeenNthCalledWith(2, "PRODUCT CREATED: ", productMocks[0].id);
      expect(console.log).toHaveBeenLastCalledWith("email sent: ", {"Body": {}});
    })

    test('logs error provided with incorrect body', async () => {
      jest.mocked(postNewProduct).mockImplementation(() => Promise.resolve(''))
      console.error = jest.fn();
      const fakeBody: Partial<SQSRecord> = {
        body: JSON.stringify({})
      }
      const fakeEvent: Partial<SQSEvent> = {
        Records: [fakeBody as SQSRecord]
      }

      await catalogBatchProcess(fakeEvent as SQSEvent);
      expect(console.error).toHaveBeenCalledWith("\"title\" is required");
    })
  })
});
