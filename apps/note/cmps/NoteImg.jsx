export function NoteImg({ note }) {
  return (
    <div className="note-img">
      {note.info.title && <h4>{note.info.title}</h4>}
      <img src={note.info.url} />
    </div>
  )
}
