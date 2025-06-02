const http = require('http')
const app = require('./app')
const initializeSocket = require('./socket')

// Validate required environment variables
if (!process.env.PORT) {
  console.error('PORT environment variable is not set')
  process.exit(1)
}

const port = parseInt(process.env.PORT, 10)
if (isNaN(port)) {
  console.error('Invalid PORT environment variable')
  process.exit(1)
}

const server = http.createServer(app)
const io = initializeSocket(server)

// Error handling for the server
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
})

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
