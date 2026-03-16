const { Link } = ReactRouterDOM
import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onUpdateNote }) {
  return <section className="note-list">
    <ul>
      {notes.map(note => <li key={note.id}>
        <NotePreview note={note} />

        <div className="actions">
          <Link to={`/note/${note.id}`}>
            <button onClick={() => onUpdateNote(note.id)} className="btn-edit">Edit</button>
          </Link>
          <Link to={`/note/${note.id}`}>
            <button onClick={() => onRemoveNote(note.id)} className="btn-remove">Delete</button>
          </Link>
        </div>
      </li>)}
    </ul>
  </section>
}