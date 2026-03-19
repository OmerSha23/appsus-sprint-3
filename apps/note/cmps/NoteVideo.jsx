export function NoteVideo({ note }) {
  return (
    <div className="note-video">
      {note.info.url && (
        <iframe
          src={note.info.url}
          title={note.info.title}
        />
      )}
      {note.info.title && <h4>{note.info.title}</h4>}
    </div>
  )
}
