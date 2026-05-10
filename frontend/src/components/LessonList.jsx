import styles from './LessonList.module.css'

export default function LessonList({ lessons, onRemove }) {
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
          </div>
          <button type="button" className={styles.remove} onClick={() => onRemove(i)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}