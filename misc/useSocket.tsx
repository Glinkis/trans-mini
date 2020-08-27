import {
  createContext,
  useEffect,
  useState,
  PropsWithChildren,
  useContext,
} from "react"
import io from "socket.io-client"

const context = createContext<SocketIOClient.Socket | null>(null)

export function useSocket() {
  const socket = useContext(context)

  if (socket == null) {
    throw new ReferenceError("Socket is not defined!")
  }

  return socket
}

export function SocketProvider({ children }: PropsWithChildren<{}>) {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null)

  useEffect(() => {
    fetch("/api/socketio").then(() => {
      const socket = io()

      socket.on("connect", () => {
        console.info("Connected")
      })

      socket.on("disconnect", () => {
        console.info("Disconnected")
      })

      socket.on("message", (message: string) => {
        console.log("Server says:", message)
      })

      socket.on("user-connected", (name: string) => {
        console.log(`User ${name} connected.`)
      })

      socket.on("user-disconnected", (name: string) => {
        console.log(`User ${name} disconnected.`)
      })

      setSocket(socket)
    })
  }, [])

  if (socket == null) {
    return null
  }

  return <context.Provider value={socket}>{children}</context.Provider>
}
