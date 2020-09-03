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

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()

    socket.emit("create-station", {
      x: `${(event.clientX / event.currentTarget.clientWidth) * 100}%`,
      y: `${(event.clientY / event.currentTarget.clientHeight) * 100}%`,
    })
  }

  return (
    <main className={styles.main} onClick={handleClick}>
      <GameCanvas>
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
