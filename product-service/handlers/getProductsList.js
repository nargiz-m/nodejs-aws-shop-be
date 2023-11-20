const { products } = require('./mock/mocks')

exports.handler = () => {
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(products)
    };
};