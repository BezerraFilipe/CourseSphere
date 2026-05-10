import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'
import LessonModal from '../components/LessonModal'
import LessonReuseBox from '../components/LessonReuseBox'
import LessonList from '../components/LessonList'
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
  const [allLessons, setAllLessons] = useState([])
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)

  const originalLessonsRef = useRef([])

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
          originalLessonsRef.current = lessonsRes.data
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

      const originalIds = originalLessonsRef.current.map(l => l.id)
      const currentIds = lessons.filter(l => l.id).map(l => l.id)
      const deletedIds = originalIds.filter(oid => !currentIds.includes(oid))

      await Promise.all([
        ...deletedIds.map(lid =>
          api.delete(`/courses/${courseId}/lessons/${lid}`)
        ),
        ...lessons
          .filter(l => l.id && !l._new)
          .map(l => api.put(`/courses/${courseId}/lessons/${l.id}`, {
            title: l.title,
            video_url: l.video_url,
            status: l.status || 'draft'
          })),
        ...lessons
          .filter(l => l._new || !l.id)
          .map(l => api.post(`/courses/${courseId}/lessons`, {
            title: l.title,
            video_url: l.video_url,
            status: l.status || 'draft'
          }))
      ])

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

  function handleAddLesson(lessonForm) {
    setLessons(l => [...l, { ...lessonForm, _new: true }])
    setShowLessonModal(false)
  }

  function handleEditLesson(index, data) {
    setEditingLesson({ index, data })
  }

  function handleSaveLesson(lessonForm) {
    setLessons(l => l.map((item, i) =>
      i === editingLesson.index ? { ...item, ...lessonForm } : item
    ))
    setEditingLesson(null)
  }

  function handleReuseLesson(lesson) {
    setLessons(l => [...l, {
      title: lesson.title,
      video_url: lesson.video_url,
      status: lesson.status,
      _new: true
    }])
  }

  function handleRemoveLesson(index) {
    setLessons(l => l.filter((_, i) => i !== index))
  }

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
          <FormField
            label="Nome"
            type="text"
            name="name"
            placeholder="Nome do curso"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
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
            <LessonReuseBox allLessons={allLessons} onReuse={handleReuseLesson} />
          )}

          <LessonList
            lessons={lessons}
            onRemove={handleRemoveLesson}
            onEdit={handleEditLesson}
          />
        </div>

        {apiError && <p className={styles.apiError}>{apiError}</p>}
        <Button type="submit" loading={loading}>
          {isEditing ? 'Salvar alterações' : 'Criar curso'}
        </Button>
      </form>

      {showLessonModal && (
        <LessonModal
          onClose={() => setShowLessonModal(false)}
          onAdd={handleAddLesson}
        />
      )}

      {editingLesson && (
        <LessonModal
          initialData={editingLesson.data}
          onClose={() => setEditingLesson(null)}
          onAdd={handleSaveLesson}
        />
      )}
    </AppLayout>
  )
}