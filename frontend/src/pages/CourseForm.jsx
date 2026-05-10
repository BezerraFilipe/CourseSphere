import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'
import api from '../services/api'
import styles from './CourseForm.module.css'

export default function CourseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({
    name: '', description: '', start_date: '', end_date: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [apiError, setApiError] = useState('')

  const [lessons, setLessons] = useState([])
  const [lessonSearch, setLessonSearch] = useState('')
  const [allLessons, setAllLessons] = useState([])
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [lessonForm, setLessonForm] = useState({ title: '', video_url: '' })
  const [lessonErrors, setLessonErrors] = useState({})

  useEffect(() => {
    async function load() {
      try {
        if (isEditing) {
          const [courseRes, lessonsRes] = await Promise.all([
            api.get(`/courses/${id}`),
            api.get(`/courses/${id}/lessons`)
          ])
          const c = courseRes.data.course
          setForm({
            name: c.name,
            description: c.description || '',
            start_date: c.start_date,
            end_date: c.end_date
          })
          setLessons(lessonsRes.data)
        }

        const myCoursesRes = await api.get('/courses?mine=true')
        const all = []
        await Promise.all(
          myCoursesRes.data.map(async course => {
            const res = await api.get(`/courses/${course.id}/lessons`)
            all.push(...res.data)
          })
        )
        setAllLessons(all)
      } finally {
        setLoadingData(false)
      }
    }
    load()
  }, [id])

  function validate() {
    const e = {}
    if (!form.name) e.name = 'Nome obrigatório'
    else if (form.name.length < 3) e.name = 'Mínimo 3 caracteres'
    if (!form.start_date) e.start_date = 'Data de início obrigatória'
    if (!form.end_date) e.end_date = 'Data de fim obrigatória'
    else if (form.start_date && form.end_date < form.start_date) {
      e.end_date = 'Data de fim deve ser igual ou posterior ao início'
    }
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    setApiError('')
    try {
      let courseId = id
      if (isEditing) {
        await api.put(`/courses/${id}`, form)
      } else {
        const res = await api.post('/courses', form)
        courseId = res.data.id
      }
      await Promise.all(
        lessons.map(l =>
          api.post(`/courses/${courseId}/lessons`, {
            title: l.title,
            video_url: l.video_url,
            status: l.status || 'draft'
          })
        )
      )
      navigate('/my-courses')
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ') || 'Erro ao salvar curso'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(e2 => ({ ...e2, [e.target.name]: '' }))
  }

  function validateLesson() {
    const e = {}
    if (!lessonForm.title) e.title = 'Título obrigatório'
    else if (lessonForm.title.length < 3) e.title = 'Mínimo 3 caracteres'
    return e
  }

  function handleAddLesson() {
    const e = validateLesson()
    if (Object.keys(e).length) return setLessonErrors(e)
    setLessons(l => [...l, { ...lessonForm, status: 'draft', _new: true }])
    setLessonForm({ title: '', video_url: '' })
    setLessonErrors({})
    setShowLessonModal(false)
  }

  function handleReuseLesson(lesson) {
    setLessons(l => [...l, { title: lesson.title, video_url: lesson.video_url, status: lesson.status, _new: true }])
  }

  function handleRemoveLesson(index) {
    setLessons(l => l.filter((_, i) => i !== index))
  }

  const filteredAllLessons = allLessons.filter(l =>
    l.title.toLowerCase().includes(lessonSearch.toLowerCase())
  )

  if (loadingData) {
    return (
      <AppLayout>
        <div className={styles.loading}><div className={styles.spinner} /></div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/my-courses')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar
        </button>
        <h1 className={styles.title}>{isEditing ? 'Editar curso' : 'Novo curso'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informações do curso</h2>
          <FormField label="Nome" type="text" name="name" placeholder="Nome do curso" value={form.name} onChange={handleChange} error={errors.name} />
          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <textarea
              className={styles.textarea}
              name="description"
              placeholder="Descrição opcional..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className={styles.dateRow}>
            <FormField label="Início" type="date" name="start_date" value={form.start_date} onChange={handleChange} error={errors.start_date} />
            <FormField label="Fim" type="date" name="end_date" value={form.end_date} onChange={handleChange} error={errors.end_date} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Aulas</h2>
            <button type="button" className={styles.addLessonBtn} onClick={() => setShowLessonModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nova aula
            </button>
          </div>

          {allLessons.length > 0 && (
            <div className={styles.reuseBox}>
              <p className={styles.reuseLabel}>Reaproveitar aula existente</p>
              <div className={styles.searchBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className={styles.searchInput}
                  placeholder="Buscar aula..."
                  value={lessonSearch}
                  onChange={e => setLessonSearch(e.target.value)}
                />
              </div>
              {lessonSearch && (
                <div className={styles.reuseList}>
                  {filteredAllLessons.map((l, i) => (
                    <button key={i} type="button" className={styles.reuseItem} onClick={() => handleReuseLesson(l)}>
                      <span className={styles.reuseTitle}>{l.title}</span>
                      <span className={styles.reuseAction}>+ Adicionar</span>
                    </button>
                  ))}
                  {filteredAllLessons.length === 0 && (
                    <p className={styles.reuseEmpty}>Nenhuma aula encontrada.</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className={styles.lessonList}>
            {lessons.length === 0 ? (
              <p className={styles.lessonsEmpty}>Nenhuma aula adicionada ainda.</p>
            ) : (
              lessons.map((l, i) => (
                <div key={i} className={styles.lessonItem}>
                  <div className={styles.lessonInfo}>
                    <span className={styles.lessonTitle}>{l.title}</span>
                    {l.video_url && <span className={styles.lessonUrl}>{l.video_url}</span>}
                  </div>
                  <button type="button" className={styles.removeLesson} onClick={() => handleRemoveLesson(i)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {apiError && <p className={styles.apiError}>{apiError}</p>}
        <Button type="submit" loading={loading}>
          {isEditing ? 'Salvar alterações' : 'Criar curso'}
        </Button>
      </form>

      {showLessonModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLessonModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Nova aula</h3>
            <FormField
              label="Título"
              type="text"
              placeholder="Título da aula"
              value={lessonForm.title}
              onChange={e => { setLessonForm(f => ({ ...f, title: e.target.value })); setLessonErrors(e2 => ({ ...e2, title: '' })) }}
              error={lessonErrors.title}
            />
            <FormField
              label="URL do vídeo (opcional)"
              type="url"
              placeholder="https://..."
              value={lessonForm.video_url}
              onChange={e => setLessonForm(f => ({ ...f, video_url: e.target.value }))}
            />
            <div className={styles.modalActions}>
              <Button variant="secondary" type="button" onClick={() => setShowLessonModal(false)}>Cancelar</Button>
              <Button type="button" onClick={handleAddLesson}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}