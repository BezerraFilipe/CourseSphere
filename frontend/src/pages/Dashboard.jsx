import { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import api from '../services/api'
import styles from './Dashboard.module.css'
import CourseCard from '../components/CourseCard'

export default function Dashboard() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/courses')
        setCourses(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  

  return (
    <AppLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Comunidade</h1>
        <div className={styles.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Buscar cursos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>Nenhum curso encontrado.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </AppLayout>
  )
}

