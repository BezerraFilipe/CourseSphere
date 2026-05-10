import { useState } from 'react'
import styles from './LessonReuseBox.module.css'

export default function LessonReuseBox({ allLessons, onReuse }) {
  const [search, setSearch] = useState('')

  const filtered = allLessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.box}>
      <p className={styles.label}>Reaproveitar aula existente</p>
      <div className={styles.searchBox}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Buscar aula..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {search && (
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <p className={styles.empty}>Nenhuma aula encontrada.</p>
          ) : (
            filtered.map((l, i) => (
              <button key={i} type="button" className={styles.item} onClick={() => onReuse(l)}>
                <span className={styles.itemTitle}>{l.title}</span>
                <span className={styles.itemAction}>+ Adicionar</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}