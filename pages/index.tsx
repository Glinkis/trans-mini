import Head from "next/head"
import styles from "../styles/Home.module.css"

const AUTHOR_URL = "https://github.com/Glinkis"
const PROJECT_URL = "https://github.com/Glinkis/trans-mini.git"

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href={PROJECT_URL} target="__blank" rel="noopener noreferrer">
            trans-mini
          </a>
        </h1>
      </main>

      <footer className={styles.footer}>
        <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
          Created by Glinkis
        </a>
      </footer>
    </div>
  )
}
