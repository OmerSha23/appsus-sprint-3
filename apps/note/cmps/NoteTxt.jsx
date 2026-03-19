export function NoteTxt({ note }) {
  return (
    <div className="note-txt">
      {note.info.title && <h4>{note.info.title}</h4>}
      <p>{note.info.txt}</p>
    </div>
  )
}
