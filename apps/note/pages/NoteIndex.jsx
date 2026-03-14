const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NotePreview } from '../cmps/NotePreview.jsx'

export function NoteIndex() {
  const [notes, setNotes] = useState([null])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] =
    useState(noteService.getFilterFromSearchParams(searchParams))

  useEffect(() => {
    loadNotes()
    //setSearchParams(utilService.trimObj(filterBy))
    noteService.query().then(setNotes)
  }, [])

  function loadNotes() {
    return noteService.query(filterBy)
      .then(setNotes)
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

  return <div className="note-index">
    <section className="note-index container">
      <NoteList
        notes={notes}
        onRemoveNote={onRemoveNote}
        onUpdateNote={onUpdateNote}
      />
    </section>
  </div>
}
