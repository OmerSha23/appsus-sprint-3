const { useNavigate } = ReactRouterDOM

function formatFullDate(ts) {
    return new Date(ts).toLocaleString([], {
        weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

export function MailDetails({ mail, onBack, onRemoveMail, onToggleStar, onNavigateMail, onCompose }) {
    if (!mail) return null

    const noteParams = new URLSearchParams({
        title: mail.subject,
        txt: `From: ${mail.from}\n\n${mail.body}`
    })
    const noteUrl = `#/note?${noteParams.toString()}`

    return <div className="mail-details">
        <div className="details-toolbar">
            <button className="toolbar-btn back-btn" onClick={onBack} title="Back to list">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="toolbar-actions">
                <button className="toolbar-btn" onClick={() => onRemoveMail(mail.id)} title="Delete">
                    <i className="fa-solid fa-trash"></i>
                </button>
                <button className="toolbar-btn" onClick={ev => onToggleStar(mail, ev)} title={mail.isStared ? 'Unstar' : 'Star'}>
                    <i className={mail.isStared ? 'fa-solid fa-star stared' : 'fa-regular fa-star'}></i>
                </button>
                <button className="toolbar-btn" onClick={onCompose} title="Reply">
                    <i className="fa-solid fa-reply"></i>
                </button>
                <button className="toolbar-btn" title="Forward">
                    <i className="fa-solid fa-share"></i>
                </button>
                <a className="toolbar-btn save-note-btn" href={noteUrl} title="Save as Note">
                    <i className="fa-solid fa-note-sticky"></i>
                    <span>Save as Note</span>
                </a>
            </div>
            <div className="toolbar-nav">
                <button className="toolbar-btn" onClick={() => onNavigateMail(mail.prevMailId)} title="Previous">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="toolbar-btn" onClick={() => onNavigateMail(mail.nextMailId)} title="Next">
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <div className="details-scroll">
            <h1 className="details-subject">{mail.subject}</h1>

            <div className="details-meta">
                <div className="meta-avatar">
                    {mail.from.charAt(0).toUpperCase()}
                </div>
                <div className="meta-info">
                    <div className="meta-row">
                        <span className="meta-from">{mail.from}</span>
                        <span className="meta-date">{formatFullDate(mail.createdAt)}</span>
                    </div>
                    <span className="meta-to">to {mail.to}</span>
                </div>
            </div>

            <div className="details-body">
                {mail.body.split('\n').map((line, i) =>
                    line === '' ? <br key={i} /> : <p key={i}>{line}</p>
                )}
            </div>

            <div className="details-reply-bar">
                <button className="reply-bar-btn" onClick={onCompose}>
                    <i className="fa-solid fa-reply"></i> Reply
                </button>
                <button className="reply-bar-btn" onClick={onCompose}>
                    <i className="fa-solid fa-share"></i> Forward
                </button>
            </div>
        </div>
    </div>
}
