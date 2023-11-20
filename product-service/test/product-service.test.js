const { handler: getProductsList } = require('../handlers/getProductsList');
const { handler: getProductsById} = require('../handlers/getProductsById');

describe('Product Service unit tests', () => {
  test("getProductsList returns list of products", () => {
    const productsResponse = getProductsList();

    expect(productsResponse.statusCode).toEqual(200);
    expect(JSON.parse(productsResponse.body).length).toBeGreaterThan(0);
  }) 

  
  test("getProductsById returns a product information when sending correct id", () => {
    const productsResponse = getProductsList();
    const fakeEvent = {
      pathParameters: {
        product_id: JSON.parse(productsResponse.body)[0].id
      }
    }
    const productResponse = getProductsById(fakeEvent);

    expect(productResponse.statusCode).toEqual(200);
    expect(JSON.parse(productResponse.body).id).toEqual(fakeEvent.pathParameters.product_id);
    expect(JSON.parse(productResponse.body).title).toBeTruthy();
    expect(typeof JSON.parse(productResponse.body).title).toBe('string');
  }) 

  test("getProductsById returns an error page when sending incorrect id", () => {
    const fakeEvent = {
      pathParameters: {
        product_id: 'random'
      }
    }
    const productResponse = getProductsById(fakeEvent);

    expect(productResponse.statusCode).toEqual(404);
    expect(productResponse.body).toEqual('Product not found');
  })
});
