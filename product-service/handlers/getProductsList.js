exports.handler = async () => {
    return {
      statusCode: 200,
      body: JSON.stringify([{
        id: 1,
        title: 'Book',
        description: 'A great book',
        price: 2
      }])
    };
};