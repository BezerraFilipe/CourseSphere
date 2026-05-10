import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 7v10l8 4 8-4V7L12 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 3v18M4 7l8 4 8-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.brandName}>CourseSphere</span>
        </div>
        <Link to="/login" className={styles.loginBtn}>Entrar</Link>
      </header>

      <main className={styles.hero}>
        <h1 className={styles.heroTitle}>Aprenda e ensine<br />sem limites</h1>
        <p className={styles.heroSubtitle}>
          Crie cursos, compartilhe conhecimento e aprenda com a comunidade.
          
        </p>
        <div className={styles.heroActions}>
          <Link to="/register" className={styles.ctaPrimary}>Começar agora</Link>
          <Link to="/login" className={styles.ctaSecondary}>Já tenho conta</Link>
        </div>
      </main>

     

      <footer className={styles.footer}>
         Filipe Bezerra Muniz da Silva | fbms@cin.ufpe.br
      </footer>
    </div>
  )
}