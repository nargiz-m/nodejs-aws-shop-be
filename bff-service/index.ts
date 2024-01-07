const fastify = require('fastify')({
    logger: true
})

// fastify.register(firstRoute)

fastify.listen({ port: 3000 }, function (err, address) {
    console.info("App is running on port 3000")
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})