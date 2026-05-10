import { useState } from 'react'
import api from '../services/api'
import styles from './CourseCard.module.css'

export default function CourseCard({ course, editable = false, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [lessons, setLessons] = useState([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [instructor, setInstructor] = useState(() => {
    const stored = localStorage.getItem(`instructor_${course.id}`)
    return stored ? JSON.parse(stored) : null
  })

  const filteredLessons = statusFilter === 'all'
    ? lessons
    : lessons.filter(l => l.status === statusFilter)

  async function handleToggle() {
    setExpanded(e => !e)
    if (!expanded) {
      setLoadingLessons(true)
      try {
        const promises = [api.get(`/courses/${course.id}/lessons`)]
        if (!instructor) {
          promises.push(fetch('https://randomuser.me/api/').then(r => r.json()))
        }
        const results = await Promise.all(promises)
        setLessons(results[0].data)
        if (!instructor && results[1]) {
          const fetched = results[1].results[0]
          localStorage.setItem(`instructor_${course.id}`, JSON.stringify(fetched))
          setInstructor(fetched)
        }
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
          </div>
          <svg
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {editable && (
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
        )}
      </div>

      {expanded && (
        <>
          <div className={styles.details}>
            <div className={styles.detailsInfo}>
              {course.description && (
                <p className={styles.detailsDesc}>{course.description}</p>
              )}
            </div>

            {instructor && (
              <div className={styles.instructor}>
                <img
                  src={instructor.picture.medium}
                  alt={instructor.name.first}
                  className={styles.instructorAvatar}
                />
                <div className={styles.instructorInfo}>
                  <span className={styles.instructorLabel}>Instrutor convidado</span>
                  <span className={styles.instructorName}>
                    {instructor.name.first} {instructor.name.last}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.lessons}>
            {loadingLessons ? (
              <div className={styles.lessonsLoading}><div className={styles.spinner} /></div>
            ) : (
              <>
                {editable && (
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
                )}
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
                      {lesson.video_url && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      )}
                    </a>
                  ))
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}