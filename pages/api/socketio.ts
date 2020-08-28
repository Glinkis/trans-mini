import socketIO from "socket.io"
import { NextApiRequest, NextApiResponse, PageConfig } from "next"
import type { Station } from "../../types"

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

    const stations: Station[] = []

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

      socket.on("create-station", (params: Omit<Station, "uid">) => {
        io.emit("create-station", createStation(stations, params))
      })

      socket.on("remove-station", (uid: string) => {
        io.emit("remove-station", removeStation(stations, uid))
      })

      socket.emit("message", `Your assigned name is "${user.name}"`)

      socket.emit("intialize-state", stations)
    })

    server.io = io
  } else {
    console.log("socket.io already running")
  }

  res.end()
}

const createStation = (stations: Station[], params: Omit<Station, "uid">) => {
  const station = { uid: getUID(), ...params }
  stations.push(station)
  return station
}

const removeStation = (stations: Station[], uid: string) => {
  const index = stations.findIndex(station => station.uid === uid)
  if (index) stations.splice(index, 1)
  return uid
}

const getUID = (id => () => `uuid-${id++}`)(0)
