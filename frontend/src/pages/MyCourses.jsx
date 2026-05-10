import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import api from '../services/api'
import styles from './MyCourses.module.css'
import { useToast } from '../contexts/ToastContext'
import CourseCard from '../components/CourseCard'

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/courses?mine=true')
        setCourses(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Deseja excluir este curso?')) return
    try {
      await api.delete(`/courses/${id}`)
      setCourses(c => c.filter(course => course.id !== id))
      showToast('Curso excluído com sucesso')
    } catch {
      showToast('Erro ao excluir curso', 'error')
    }
  }

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Meus cursos</h1>
        <Link to="/courses/new" className={styles.newBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo curso
        </Link>
      </div>

      <div className={styles.searchBox}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Buscar meus cursos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}><div className={styles.spinner} /></div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>Você ainda não tem cursos.</p>
          <Link to="/courses/new" className={styles.emptyLink}>Criar primeiro curso</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              editable
              onEdit={() => navigate(`/courses/${course.id}/edit`)}
              onDelete={() => handleDelete(course.id)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  )
}