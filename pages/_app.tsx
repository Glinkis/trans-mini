import { useEffect, Fragment } from "react"
import type { AppProps } from "next/app"
import io from "socket.io-client"
import "../styles/globals.css"
import Head from "next/head"

function App({ Component }: AppProps) {
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
    })
  }, [])

  return (
    <Fragment>
      <Head>
        <title>trans-mini</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component />
    </Fragment>
  )
}

export default App
