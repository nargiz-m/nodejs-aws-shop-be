import { APIGatewayProxyEvent } from "aws-lambda";
import { handler as getProductsById } from "../handlers/getProductsById";
import { handler as getProductsList } from "../handlers/getProductsList";
import { getProductsWithStocks } from "../services/getProductsWithStocks";
import { getSingleProduct } from "../services/getSingleProduct";
import productMocks from "./mocks/product-mocks";

jest.mock('../services/getProductsWithStocks')
jest.mock('../services/getSingleProduct')

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
});
