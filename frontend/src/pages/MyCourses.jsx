import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import api from '../services/api'
import styles from './MyCourses.module.css'
import { useToast } from '../contexts/ToastContext'

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
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

  function toggleExpand(id) {
    setExpanded(e => e === id ? null : id)
  }

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
            <MyCourseCard
              key={course.id}
              course={course}
              expanded={expanded === course.id}
              onToggle={() => toggleExpand(course.id)}
              onDelete={() => handleDelete(course.id)}
              onEdit={() => navigate(`/courses/${course.id}/edit`)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  )
}

function MyCourseCard({ course, expanded, onToggle, onDelete, onEdit }) {
  const [lessons, setLessons] = useState([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLessons = statusFilter === 'all'
    ? lessons
    : lessons.filter(l => l.status === statusFilter)

  async function handleToggle() {
    onToggle()
    if (!expanded && lessons.length === 0) {
      setLoadingLessons(true)
      try {
        const res = await api.get(`/courses/${course.id}/lessons`)
        setLessons(res.data)
      } finally {
        setLoadingLessons(false)
      }
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <button className={styles.cardHeader} onClick={handleToggle}>
          <div className={styles.cardInfo}>
            <h2 className={styles.cardTitle}>{course.name}</h2>
            <span className={styles.cardDates}>
              {new Date(course.start_date).toLocaleDateString('pt-BR')} →{' '}
              {new Date(course.end_date).toLocaleDateString('pt-BR')}
            </span>
            {course.description && (
              <p className={styles.cardDesc}>{course.description}</p>
            )}
          </div>
          <svg
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEdit} title="Editar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className={styles.deleteBtn} onClick={onDelete} title="Excluir">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className={styles.lessons}>
          {loadingLessons ? (
            <div className={styles.lessonsLoading}><div className={styles.spinner} /></div>
          ) : (
            <>
              <div className={styles.filterRow}>
                {['all', 'published', 'draft'].map(s => (
                  <button
                    key={s}
                    className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === 'all' ? 'Todas' : s === 'published' ? 'Publicadas' : 'Rascunhos'}
                  </button>
                ))}
              </div>
              {filteredLessons.length === 0 ? (
                <p className={styles.lessonsEmpty}>Nenhuma aula encontrada.</p>
              ) : (
                filteredLessons.map(lesson => (
                  <a  
                    key={lesson.id}
                    href={lesson.video_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.lessonItem}
                  >
                    <span className={`${styles.lessonStatus} ${lesson.status === 'published' ? styles.published : styles.draft}`}>
                      {lesson.status === 'published' ? 'Publicada' : 'Rascunho'}
                    </span>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                  </a>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}