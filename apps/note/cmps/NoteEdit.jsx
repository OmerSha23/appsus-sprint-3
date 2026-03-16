const { useEffect, useState } = React
const { useNavigate } = ReactRouterDOM
const { useParams } = ReactRouterDOM
import { noteService } from "../../note/services/note.service.js"

export function NoteEdit() {
    const [note, setNote] = useState(noteService.getEmptyNote())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            noteService.get(note.id)
                .then(setNote)
        }
    }, [])

    function handleChange({ target }) {
        const { type, name, value } = target
        setNote(prev => ({ ...prev, [name]: type === 'text' }))
    }

    function onSaveNote(ev) {
        ev.preventDefault()
        noteService.save(note)
            .then(() => navigate('/note'))
    }

    return <form className="note-edit" onSubmit={onSaveNote}>
        <label htmlFor="title">title:</label>
        <input
            type="text"
            placeholder="Title"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
        />

        <label htmlFor="content">content:</label>
        <input
            type="content"
            placeholder="Content"
            id="content"
            name="content"
            value={note.content}
            onChange={handleChange} />

        <button>Save</button>
    </form>
}