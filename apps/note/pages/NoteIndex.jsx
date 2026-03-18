const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
// import { NoteFilter } from '../cmps/NoteFilter.jsx'
import { NoteEdit } from '../cmps/NoteEdit.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  // const [filterBy, setFilterBy] = useState(noteService.getDefaultFilter())
  const [noteIdToEdit, setNoteIdToEdit] = useState(null)

  useEffect(()=> {
    loadNotes()
  }, [])

  function loadNotes() {
    return noteService.query()
      .then(notes => setNotes(notes))
  }

  function onRemoveNote(noteId) {
    noteService.remove(noteId)
      .then(() => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId))
        // onClearFilter()
        showSuccessMsg(`Note removed`)
      })
      .catch(err => showErrorMsg(`Couldn't remove note`))
  }

  // function onClearFilter() {
  //   setFilterBy(noteService.getDefaultFilter())
  // }

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
    setNoteIdToEdit(null)
    loadNotes()
  }

  function onEditNote(noteId) {
    setNoteIdToEdit(noteId)
  }

  // function onSetFilterBy(newFilter) {
  //   setFilterBy(newFilter)
  // }

  if (!notes) return <div>Loading...</div>

  return (
    <div className='notes-index'>
      <React.Fragment>
        <NoteEdit
          noteIdToEdit={noteIdToEdit}
          onSaveNote={onSaveNote}
          onAddNote={() => setNoteIdToEdit(null)} />
        {/* <button onClick={() => setNoteIdToEdit(null)}>Add Note</button> */}
        {/* <h2>Notes list</h2> */}
        {/* <NoteFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} /> */}
        <NoteList notes={notes} onRemoveNote={onRemoveNote} onEditNote={onEditNote} />
      </React.Fragment>
    </div>
  )
}