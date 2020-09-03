import { useEffect, useState } from "react"
import type { MouseEvent } from "react"

import type { Station } from "../types"
import { useSocket } from "../misc/useSocket"
import { GameCanvas } from "../components/GameCanvas"
import { StationGraphic } from "../components/StationGraphic"
import styles from "../styles/Home.module.css"

type Stations = readonly Station[]

export default function Home() {
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

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    event.preventDefault()

    const bounds = event.currentTarget.getBoundingClientRect()

    const positionX = event.clientX - bounds.left
    const positionY = event.clientY - bounds.top

    const sizeX = bounds.width
    const sizeY = bounds.height

    socket.emit("create-station", {
      x: `${(positionX / sizeX) * 100}%`,
      y: `${(positionY / sizeY) * 100}%`,
    })
  }

  return (
    <main className={styles.main}>
      <GameCanvas onClick={handleClick}>
        {stations.map(circle => (
          <StationGraphic station={circle} key={circle.uid} />
        ))}
      </GameCanvas>
    </main>
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
