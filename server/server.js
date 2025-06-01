const http = require('http')
const app = require('./app')
const initializeSocket = require('./socket')

const server = http.createServer(app)
const io = initializeSocket(server)

const port = process.env.PORT

server.listen(port)
