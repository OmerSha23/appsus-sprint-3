import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onUpdateNote }) {
  return <section className="note-list">
    <ul>
      {notes.map(note => <li key={note.id}>
        <NotePreview note={note} />

        <div className="actions">
          <button onClick={() => onUpdateNote(note.id)} className="btn-edit">Edit</button>
          <button onClick={() => onRemoveNote(note.id)} className="btn-remove">Delete</button>
        </div>
      </li>)}
    </ul>
  </section>
}