import { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import api from '../services/api'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

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

  function toggleExpand(id) {
    setExpanded(e => e === id ? null : id)
  }

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
            <CourseCard
              key={course.id}
              course={course}
              expanded={expanded === course.id}
              onToggle={() => toggleExpand(course.id)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  )
}

function CourseCard({ course, expanded, onToggle }) {
  const [lessons, setLessons] = useState([])
  const [loadingLessons, setLoadingLessons] = useState(false)

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

      {expanded && (
        <div className={styles.lessons}>
          {loadingLessons ? (
            <div className={styles.lessonsLoading}><div className={styles.spinner} /></div>
          ) : lessons.length === 0 ? (
            <p className={styles.lessonsEmpty}>Nenhuma aula cadastrada.</p>
          ) : (
            lessons.map(lesson => (
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
                {lesson.video_url && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                )}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}