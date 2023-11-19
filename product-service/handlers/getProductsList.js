const { products } = require('./mock/mocks')

exports.handler = async () => {
    return {
      statusCode: 200,
      body: JSON.stringify(products)
    };
};