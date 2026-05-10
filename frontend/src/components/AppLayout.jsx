import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './AppLayout.module.css'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 7v10l8 4 8-4V7L12 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 3v18M4 7l8 4 8-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.brandName}>CourseSphere</span>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navActive : ''}`
          }>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Comunidade
          </NavLink>

          <NavLink to="/my-courses" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navActive : ''}`
          }>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
            Meus cursos
          </NavLink>
        </nav>

        <div className={styles.bottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <span className={styles.userName}>{user?.name}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}