import { useState } from 'react'
import FormField from './FormField'
import Button from './Button'
import styles from './LessonModal.module.css'

export default function LessonModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', video_url: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.title) e.title = 'Título obrigatório'
    else if (form.title.length < 3) e.title = 'Mínimo 3 caracteres'
    return e
  }

  function handleAdd() {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onAdd(form)
    setForm({ title: '', video_url: '' })
    setErrors({})
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Nova aula</h3>
        <FormField
          label="Título"
          type="text"
          placeholder="Título da aula"
          value={form.title}
          onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(e2 => ({ ...e2, title: '' })) }}
          error={errors.title}
        />
        <FormField
          label="URL do vídeo (opcional)"
          type="url"
          placeholder="https://..."
          value={form.video_url}
          onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
        />
        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={handleAdd}>Adicionar</Button>
        </div>
      </div>
    </div>
  )
}