import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
  query,
  get,
  remove,
  save,
  getEmptyNote,
  getDefaultFilter,
  getFilterFromSearchParams,
}

function getDefaultFilter(filterBy = { txt: '' }) {
  return { txt: filterBy.txt ?? '' }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) ?? defaultFilter[field]
  }
  return filterBy
}

function _getNoteSearchText(note = { info: {} }) {
  const { info = {} } = note
  return {
    txt: info.txt ?? '',
    title: info.title ?? '',
    todosTxt: (info.todos ?? []).map((t) => t.txt).join(' '),
  }
}

function query(filterBy = {}) {
  const filter = getDefaultFilter(filterBy)
  return storageService.query(NOTE_KEY).then((notes) => {
    if (filter.txt) {
      const regExp = new RegExp(filter.txt, 'i')
      notes = notes.filter((note) => {
        const searchable = _getNoteSearchText(note)
        const text = [searchable.txt, searchable.title, searchable.todosTxt].join(' ')
        return regExp.test(text)
      })
    }
    return notes
  })
}

function get(noteId) {
  return storageService.get(NOTE_KEY, noteId)
    .then(note => {
      note = _setNextPrevNoteId(note)
      return note
    })
}

function _createNotes() {
  let notes = utilService.loadFromStorage(NOTE_KEY)
  if (!notes || !notes.length) {
    notes = [
      {
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: { backgroundColor: '#00d' },
        info: { txt: 'Fullstack Me Baby!' },
      },
      {
        id: 'n102',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: false,
        style: { backgroundColor: '#0d0' },
        info: { url: 'http://some-img/me', title: 'Bobi and Me' },
      },
      {
        id: 'n103',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
        style: { backgroundColor: '#d00' },
        info: {
          title: 'Get my stuff together',
          todos: [
            { txt: 'Driving licences', isDone: true },
            { txt: 'Coding power', isDone: false },
          ],
        },
      },
      {
        id: 'n104',
        createdAt: 1112225,
        type: 'NoteTxt',
        isPinned: false,
        style: { backgroundColor: '#fd0' },
        info: { txt: 'A simple text note' },
      },
    ]
    utilService.saveToStorage(NOTE_KEY, notes)
  }
}

function getEmptyNote(type) {
  const note = {
    createdAt: Date.now(),
    type,
    isPinned: false,
    style: { backgroundColor: '#fff' },
  }
  if (type === 'NoteTxt') {
    note.info = { txt: '' }
  } else if (type === 'NoteImg') {
    note.info = { url: '', title: '' }
  } else if (type === 'NoteTodos') {
    note.info = { title: '', todos: [] }
  } else if (type === 'NoteVideo') {
    note.info = { url: '', title: '' }
  } else {
    note.info = { txt: '' }
  }
  return note
}

function _createNote(type, createdAt) {
  const note = getEmptyNote(type)
  note.id = utilService.makeId()
  if (createdAt !== undefined) note.createdAt = createdAt
  return note
}

function _setNextPrevNoteId(note) {
  return storageService.query(NOTE_KEY).then((notes) => {
    const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
    const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] :
      notes[0]
    const prevNote = notes[noteIdx - 1] ? notes[noteIdx - 1] :
      notes[notes.length - 1]
    note.nextNoteId = nextNote.id
    note.prevNoteId = prevNote.id
    return note
  })
}

function remove(noteId) {
  return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
  if (note.id) {
    return storageService.put(NOTE_KEY, note)
  } else {
    return storageService.post(NOTE_KEY, note)
  }
}
