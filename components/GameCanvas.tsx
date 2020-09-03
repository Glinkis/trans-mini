import { MouseEvent } from "react"
import styles from "./GameCanvas.module.css"

interface Props {
  children: React.ReactNode
  onClick(event: MouseEvent<SVGSVGElement>): void
}

export function GameCanvas({ children, onClick }: Props) {
  return (
    <svg className={styles.canvas} onClick={onClick} viewBox="0 0 200 200">
      {children}
    </svg>
  )
}
