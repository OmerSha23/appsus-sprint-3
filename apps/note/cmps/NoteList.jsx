import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onUpdateNote }) {
  return (
    <section className="note-list">
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <button onClick={() => onRemoveNote(note.id)}>x</button>
            <NotePreview note={note} onRemoveNote={onRemoveNote} onUpdateNote={onUpdateNote}/>
          </li>
        ))}
      </ul>
    </section>
  )
}