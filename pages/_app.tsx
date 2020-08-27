import { useEffect, Fragment } from "react"
import type { AppProps } from "next/app"
import "../styles/globals.css"
import Head from "next/head"
import { SocketProvider } from "../misc/useSocket"

function App({ Component }: AppProps) {
  return (
    <SocketProvider>
      <Head>
        <title>trans-mini</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component />
    </SocketProvider>
  )
}

export default App
