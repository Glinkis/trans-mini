import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"

import type { Station } from "../types"
import { useSocket } from "../misc/useSocket"
import { StationGraphic } from "../components/StationGraphic"
import styles from "../styles/Home.module.css"

type Stations = readonly Station[]

export default function Home() {
  const svg = useFullscreenSVG()
  const socket = useSocket()

  const [stations, setStations] = useState<Stations>([])

  useEffect(() => {
    socket.on("intialize-state", setStations)

    socket.on("create-station", (station: Station) => {
      setStations(state => createStation(state, station))
    })

    socket.on("remove-station", (uid: string) => {
      setStations(state => removeStation(state, uid))
    })
  }, [socket])

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()

    socket.emit("create-station", {
      x: `${(event.clientX / svg.current!.clientWidth) * 100}%`,
      y: `${(event.clientY / svg.current!.clientHeight) * 100}%`,
    })
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <svg className={styles.canvas} ref={svg} onClick={handleClick}>
          {stations.map(circle => (
            <StationGraphic station={circle} key={circle.uid} />
          ))}
        </svg>
      </main>
    </div>
  )
}

function createStation(state: Stations, station: Station) {
  if (state.some(({ uid }) => uid === station.uid)) {
    return state
  }
  return [...state, station]
}

function removeStation(state: Stations, uid: string): Station[] {
  return state.filter(station => {
    return station.uid !== uid
  })
}

function useFullscreenSVG() {
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const updateSize = () => {
      if (svg.current) {
        svg.current.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`)
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return svg
}
