import { useRef, useEffect } from "react"
import styles from "./GameCanvas.module.css"

interface Props {
  children: React.ReactNode
}

export function GameCanvas({ children }: Props) {
  const ref = useFullscreenSVG()

  return (
    <svg className={styles.canvas} ref={ref}>
      {children}
    </svg>
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
