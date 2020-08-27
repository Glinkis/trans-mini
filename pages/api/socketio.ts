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

const users = new Map<string, User>()

export default (req: NextApiRequest, res: NextApiResponse) => {
  const server = res.socket["server"]

  if (!server.io) {
    const io = socketIO(server)

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

      socket.emit("message", `Your assigned name is "${user.name}"`)
    })

    server.io = io
  } else {
    console.log("socket.io already running")
  }

  res.end()
}
