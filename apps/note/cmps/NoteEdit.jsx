const { useEffect, useState } = React
const { useNavigate } = ReactRouterDOM
const { useParams } = ReactRouterDOM
import { noteService } from "../../note/services/note.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

export function NoteEdit({ noteIdToEdit, onSaveNote: onSaveNoteCb, onAddNote }) {
    const [note, setNote] = useState(noteService.getEmptyNote('NoteTxt'))
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const idToLoad = noteIdToEdit || params.id
        if (idToLoad) {
            noteService.get(idToLoad)
                .then(setNote)
        } else {
            setNote(noteService.getEmptyNote('NoteTxt'))
        }
    }, [noteIdToEdit, params.id])

    function handleChange({ target }) {
        const { name, value } = target
        setNote(prev => ({
            ...prev,
            info: { ...prev.info, [name]: value }
        }))
    }

    function onSaveNote(ev) {
        ev.preventDefault()
        noteService.save(note)
            .then(() => {
                showSuccessMsg(note.id ? 'Note saved' : 'Note added')
                setNote(noteService.getEmptyNote('NoteTxt'))
                if (onSaveNoteCb) onSaveNoteCb()
                navigate('/note')
            })
            .catch(err => showErrorMsg(note.id ? "Couldn't save note" : "Couldn't add note"))
    }

    return <div className="note-edit-container">
        <form className="note-edit" onSubmit={onSaveNote}>
        <input
            type="text"
            className="note-edit-title"
            placeholder="Title"
            id="title"
            name="title"
            value={note.info.title || ''}
            onChange={handleChange}
        />

        <input
            type="text"
            className="note-edit-content"
            placeholder="Take a note..."
            id="content"
            name="txt"
            value={note.info.txt || ''}
            onChange={handleChange} />

        <button type="submit" className="note-edit-btn">Save Note</button>
    </form>
    </div>
}