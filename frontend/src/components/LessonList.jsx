import styles from './LessonList.module.css'

export default function LessonList({ lessons, onRemove, onEdit }) {
  if (lessons.length === 0) {
    return <p className={styles.empty}>Nenhuma aula adicionada ainda.</p>
  }

  return (
    <div className={styles.list}>
      {lessons.map((l, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.info}>
            <span className={styles.title}>{l.title}</span>
            {l.video_url && <span className={styles.url}>{l.video_url}</span>}
            <span className={`${styles.status} ${l.status === 'published' ? styles.published : styles.draft}`}>
              {l.status === 'published' ? 'Publicada' : 'Rascunho'}
            </span>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.editBtn} onClick={() => onEdit(i, l)} title="Editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button type="button" className={styles.removeBtn} onClick={() => onRemove(i)} title="Remover">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}