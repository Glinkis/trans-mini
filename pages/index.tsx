import styles from "../styles/Home.module.css"
import { useEffect, useRef, useState, MouseEvent } from "react"
import { useSocket } from "../misc/useSocket"

interface Circle {
  x: string
  y: string
}

export default function Home() {
  const [circles, setCircles] = useState<Circle[]>([])

  const svg = useFullscreenSVG()
  const socket = useSocket()

  useEffect(() => {
    socket.on("intialize-state", setCircles)

    socket.on("add-circle", (circle: Circle) => {
      setCircles(state => [...state, circle])
    })
  }, [socket])

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()

    if (svg.current == null) {
      return
    }

    socket.emit("add-circle", {
      x: `${(event.clientX / svg.current.clientWidth) * 100}%`,
      y: `${(event.clientY / svg.current.clientHeight) * 100}%`,
    })
  }

  return (
    <div className={styles.container}>
      <main className={styles.main} onClick={handleClick}>
        <svg className={styles.canvas} ref={svg}>
          {circles.map((circle, i) => (
            <circle key={i} cx={circle.x} cy={circle.y} r="2%" />
          ))}
        </svg>
      </main>
    </div>
  )
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
