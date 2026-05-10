import { Link } from 'react-router-dom'
import styles from './AuthLayout.module.css'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L4 7v10l8 4 8-4V7L12 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M12 3v18M4 7l8 4 8-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className={styles.brandName}>CourseSphere</span>
        <span className={styles.brandTagline}>Aprenda e ensine sem limites</span>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}