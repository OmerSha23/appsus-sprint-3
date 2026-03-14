export function NoteTodos({ note }) {
  const { title, todos } = note.info
  return (
    <div className="note-todos">
      {title && <h4>{title}</h4>}
      <ul>
        {todos?.map((todo, idx) => (
          <li key={idx} className={todo.isDone ? 'done' : ''}>
            {todo.txt}
          </li>
        ))}
      </ul>
    </div>
  )
}
