import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, onSelectMail, onRemoveMail, onToggleStar, onToggleRead }) {
    if (!mails) return <div className="mail-list loading">
        <p>Loading mails...</p>
    </div>

    if (!mails.length) return <div className="mail-list empty">
        <i className="fa-regular fa-envelope-open"></i>
        <p>No messages here</p>
    </div>

    return <ul className="mail-list clean-list">
        {mails.map(mail =>
            <MailPreview
                key={mail.id}
                mail={mail}
                onSelectMail={onSelectMail}
                onRemoveMail={onRemoveMail}
                onToggleStar={onToggleStar}
                onToggleRead={onToggleRead}
            />
        )}
    </ul>
}
