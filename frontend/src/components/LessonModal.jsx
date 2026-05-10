import { useState } from 'react'
import FormField from './FormField'
import Button from './Button'
import styles from './LessonModal.module.css'

export default function LessonModal({ onClose, onAdd, initialData = null }) {
  const isEditing = !!initialData
  const [form, setForm] = useState(
    initialData
      ? { title: initialData.title, video_url: initialData.video_url || '', status: initialData.status || 'draft' }
      : { title: '', video_url: '', status: 'draft' }
  )
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
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{isEditing ? 'Editar aula' : 'Nova aula'}</h3>
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
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.select}
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicada</option>
          </select>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={handleAdd}>
            {isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </div>
  )
}