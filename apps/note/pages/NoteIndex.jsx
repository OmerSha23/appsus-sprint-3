const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteFilter } from '../cmps/NoteFilter.jsx'
import { NoteEdit } from '../cmps/NoteEdit.jsx'

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  const [filterBy, setFilterBy] = useState(noteService.getDefaultFilter())

  useEffect(()=> {
    loadNotes()
  }, [filterBy])

  function loadNotes() {
    return noteService.query(filterBy)
      .then(notes => setNotes(notes))
  }

  function onRemoveNote(noteId) {
    noteService.remove(noteId)
      .then(() => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId))
        onClearFilter()
        showSuccessMsg(`Note removed`)
      })
      .catch(err => showErrorMsg(`Couldn't remove note`))
  }

  function onClearFilter() {
    setFilterBy(noteService.getDefaultFilter())
  }

  function onUpdateNote(noteId, updates) {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return
    const updatedNote = { ...note, ...updates }
    noteService.save(updatedNote).then(() => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? updatedNote : n))
      )
    })
  }

  function onSaveNote() {

  }

  function onSetFilterBy(newFilter) {
    setFilterBy(newFilter)
  }

  if (!notes) return <div>Loading...</div>

  return (
    <div className='notes-index'>
      <React.Fragment>
        <NoteEdit
          onSaveNote={onSaveNote} />
        <Link to="/note/edit"><button>Add Note</button></Link>
        <h2>Notes list</h2>
        <NoteFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <Link to="/note/edit"><button>Edit</button></Link>
        <NoteList notes={notes} onRemoveNote={onRemoveNote} />
      </React.Fragment>
    </div>
  )
}