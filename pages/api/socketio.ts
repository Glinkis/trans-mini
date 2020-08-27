import socketIO from "socket.io"
import { NextApiRequest, NextApiResponse, PageConfig } from "next"

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const server = res.socket["server"]

  if (!server.io) {
    const io = socketIO(server)

    io.on("connection", socket => {
      socket.broadcast.emit("a user connected")
      socket.emit("message", "Hello there!")
    })

    server.io = io
  } else {
    console.log("socket.io already running")
  }

  res.end()
}
