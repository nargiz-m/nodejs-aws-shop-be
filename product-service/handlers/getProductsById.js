const { products } = require("./mock/mocks");

exports.handler = async (event) => {
  const product = products.find(product => product.id === event.pathParameters.product_id)
   
  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product)
    };
  }

  return {
    statusCode: 404,
    body: 'Product not found'
  }
};