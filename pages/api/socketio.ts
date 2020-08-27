import socketIO from "socket.io"
import { NextApiRequest, NextApiResponse, PageConfig } from "next"

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

interface User {
  name: string
}

interface Circle {
  x: string
  y: string
}

const users = new Map<string, User>()

export default (req: NextApiRequest, res: NextApiResponse) => {
  const server = res.socket["server"]

  if (!server.io) {
    const io = socketIO(server)

    const circles: Circle[] = []

    io.on("connection", socket => {
      const user: User = {
        name: `User-${users.size}`,
      }

      socket.broadcast.emit("user-connected", user.name)
      users.set(socket.id, user)

      socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", user.name)
        users.delete(socket.id)
      })

      socket.on("add-circle", (circle: Circle) => {
        circles.push(circle)
        io.emit("add-circle", circle)
      })

      socket.emit("message", `Your assigned name is "${user.name}"`)

      socket.emit("intialize-state", circles)
    })

    server.io = io
  } else {
    console.log("socket.io already running")
  }

  res.end()
}
