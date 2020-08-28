import anime from "animejs"
import { memo } from "react"
import type { MouseEvent, PointerEvent } from "react"

import { useSocket } from "../misc/useSocket"
import type { Station } from "../types"

import styles from "./StationGraphic.module.css"

export interface Props {
  station: Station
}

export const StationGraphic = memo(function Station({ station }: Props) {
  const socket = useSocket()

  function animateCircle(circle: SVGCircleElement | null) {
    anime({
      targets: circle,
      r: 12,
    })
  }

  function handleClick(event: MouseEvent<SVGCircleElement>) {
    event.stopPropagation()
    socket.emit("remove-station", station.uid)
  }

  function handleOver(event: PointerEvent<SVGCircleElement>) {
    anime.remove(event.target)
    anime({
      targets: event.target,
      r: 24,
      stroke: "rgb(200 30 60 / 1)",
      "stroke-width": {
        value: 8,
        delay: 150,
      },
    })
  }

  function handleOut(event: PointerEvent<SVGCircleElement>) {
    anime.remove(event.target)
    anime({
      targets: event.target,
      r: 12,
      stroke: "rgb(0 0 0 / 0)",
      "stroke-width": 0,
    })
  }

  return (
    <circle
      cx={station.x}
      cy={station.y}
      ref={animateCircle}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      className={styles.station}
    />
  )
})
