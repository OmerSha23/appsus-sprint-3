export function NoteImg({ note }) {
  return (
    <div className="note-img">
      <img src={note.info.url} />
      {note.info.title && <h4>{note.info.title}</h4>}
    </div>
  )
}
