import { NoteTxt } from "./NoteTxt.jsx"
import { NoteTodos } from "./NoteTodos.jsx"
import { NoteImg } from "./NoteImg.jsx"
import { NoteVideo } from "./NoteVideo.jsx"

export function NotePreview({note}) {
   return <DynamicNote
        note={note}/>
}

function DynamicNote(props) {
    const cmpMap = {
        NoteTxt: <NoteTxt {...props} />,
        NoteTodos: <NoteTodos {...props} />,
        NoteImg: <NoteImg {...props} />,
        NoteVideo: <NoteVideo {...props} />,
    }
    return cmpMap[props.note.type]
}