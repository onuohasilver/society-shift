import app from './app'
import * as http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000
const mongoURI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/society-shift'

const server = http.createServer(app)
const io = new Server(server)

mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
