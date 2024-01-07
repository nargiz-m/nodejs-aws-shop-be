require("dotenv").config();
const fastify = require('fastify')({
    logger: true
})

fastify.all("/*", {
  handler: async function (request, reply) {
    let recipientServiceName = request.url.split('/')[1];
    if(Object.keys(request.query).length > 0){
      recipientServiceName = recipientServiceName.split('?')[0]
    }
    const recipientURL = process.env[recipientServiceName];
    
    if(!recipientURL) {
      reply.status(502).send({message: 'Cannot process request'})
    }
    
    try {
      const urlPath = request.url.replace(`/${recipientServiceName}`, '');
      const response = await fetch(`${recipientURL}${urlPath}`, {
        headers: {
          authorization: request.headers.authorization
        }
      });
      const data = await response.json();
      reply.status(data.statusCode).send(data);
    } catch (error) {
      reply.status(500).send('Server error occurred');
    }
  }
})

fastify.listen({ port: 3000 }, function (err, address) {
    console.info("App is running on port 3000")
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})