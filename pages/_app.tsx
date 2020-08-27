import { useEffect } from "react"
import type { AppProps } from "next/app"
import io from "socket.io-client"
import "../styles/globals.css"

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    fetch("/api/socketio").finally(() => {
      const socket = io()

      socket.on("connect", () => {
        console.info("Connected")
      })

      socket.on("disconnect", () => {
        console.info("Disconnected")
      })

      socket.on("message", message => {
        console.log(message)
      })
    })
  })

  return <Component {...pageProps} />
}

export default App
