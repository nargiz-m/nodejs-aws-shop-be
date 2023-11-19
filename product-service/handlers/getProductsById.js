exports.handler = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(`Hello, CDK! You've hit ${event.path}\n`)
    };
};