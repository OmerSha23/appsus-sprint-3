import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onEditNote }) {
  return <section className="note-list">
    <ul>
      {notes.map(note => <li key={note.id}>
        <NotePreview note={note} />

        <div className="actions">
          <button onClick={() => onEditNote(note.id)} className="btn-edit">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button onClick={() => onRemoveNote(note.id)} className="btn-remove">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>)}
    </ul>
  </section>
}
