const { useState } = React

function formatDate(ts) {
    const date = new Date(ts)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function MailPreview({ mail, onSelectMail, onRemoveMail, onToggleStar, onToggleRead }) {
    const [isHovered, setIsHovered] = useState(false)

    return <li
        className={`mail-preview ${mail.isRead ? 'read' : 'unread'}`}
        onClick={() => onSelectMail(mail)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <button
            className={`star-btn ${mail.isStared ? 'stared' : ''}`}
            onClick={ev => onToggleStar(mail, ev)}
            title={mail.isStared ? 'Unstar' : 'Star'}
        >
            <i className={mail.isStared ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
        </button>

        <span className="preview-from">{mail.from.split('@')[0]}</span>
        <span className="preview-subject">{mail.subject.length > 45 ? mail.subject.slice(0, 45) + '...' : mail.subject}</span>
        <span className="preview-snippet"> — {mail.body.replace(/\n/g, ' ').slice(0, 60)}...</span>

        {isHovered
            ? <div className="preview-actions" onClick={ev => ev.stopPropagation()}>
                <button onClick={() => onRemoveMail(mail.id)} title="Delete">
                    <i className="fa-solid fa-trash"></i>
                </button>
                <button onClick={ev => onToggleRead(mail, ev)} title={mail.isRead ? 'Mark unread' : 'Mark read'}>
                    <i className={mail.isRead ? 'fa-regular fa-envelope' : 'fa-solid fa-envelope-open'}></i>
                </button>
                <button onClick={ev => onToggleStar(mail, ev)} title={mail.isStared ? 'Unstar' : 'Star'}>
                    <i className={mail.isStared ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                </button>
            </div>
            : <span className="preview-date">{formatDate(mail.createdAt)}</span>
        }
    </li>
}
