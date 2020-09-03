import anime from "animejs"
import { memo } from "react"
import type { MouseEvent, PointerEvent, FocusEvent } from "react"

import type { Station } from "../types"

import styles from "./StationGraphic.module.css"

export interface Props {
  station: Station
}

export const StationGraphic = memo(function Station({ station }: Props) {
  function handleClick(event: MouseEvent<SVGCircleElement>) {
    event.stopPropagation()
  }

  function handleOver(event: PointerEvent<SVGCircleElement>) {
    if (event.currentTarget !== document.activeElement) {
      anime.remove(event.currentTarget)
      animateOver(event.currentTarget)
    }
  }

  function handleOut(event: PointerEvent<SVGCircleElement>) {
    if (event.currentTarget !== document.activeElement) {
      anime.remove(event.currentTarget)
      animateOut(event.currentTarget)
    }
  }

  function handleFocus(event: FocusEvent<SVGCircleElement>) {
    anime.remove(event.currentTarget)
    animateFocus(event.currentTarget)
  }

  function handleBlur(event: FocusEvent<SVGCircleElement>) {
    anime.remove(event.currentTarget)
    animateBlur(event.currentTarget)
  }

  return (
    <circle
      tabIndex={0}
      cx={station.x}
      cy={station.y}
      ref={animateCreated}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={styles.station}
    />
  )
})

function animateCreated(target: SVGCircleElement | null) {
  anime({ targets: target, r: 12 })
}

function animateOver(target: SVGCircleElement | null) {
  anime({ targets: target, r: 16 })
}

function animateOut(target: SVGCircleElement | null) {
  anime({ targets: target, r: 12 })
}

function animateFocus(target: SVGCircleElement | null) {
  anime({
    targets: target,
    r: 32,
    stroke: "rgb(200 30 60 / 1)",
    "stroke-width": {
      value: 8,
      delay: 150,
    },
  })
}

function animateBlur(target: SVGCircleElement | null) {
  anime.remove(target)
  anime({
    targets: target,
    r: 12,
    stroke: "rgb(200 30 60 / 0)",
    "stroke-width": 0,
  })
}
