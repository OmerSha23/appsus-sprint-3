const { useState, useEffect, useRef } = React
import { mailService } from '../services/mail.service.js'

export function MailCompose({ onSendMail, onSaveDraft, onClose }) {
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [isMinimized, setIsMinimized] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const draftTimerRef = useRef(null)
    const loggedInUser = mailService.getLoggedInUser()

    // Auto-save draft every 5 seconds if there's any content
    useEffect(() => {
        draftTimerRef.current = setInterval(() => {
            if (!isSent && (to || subject || body)) {
                const draft = {
                    ...mailService.getEmptyMail(),
                    to,
                    subject,
                    body,
                    isDraft: true,
                    isSent: false,
                    createdAt: Date.now(),
                }
                onSaveDraft(draft)
            }
        }, 5000)
        return () => clearInterval(draftTimerRef.current)
    }, [to, subject, body, isSent])

    function onSend() {
        if (!to.trim()) return
        const sentMail = {
            ...mailService.getEmptyMail(),
            to: to.trim(),
            subject,
            body,
            isDraft: false,
            isSent: true,
            isRead: true,
            sentAt: Date.now(),
            createdAt: Date.now(),
        }
        setIsSent(true)
        clearInterval(draftTimerRef.current)
        onSendMail(sentMail)
    }

    return <div className={`mail-compose ${isMinimized ? 'minimized' : ''}`}>
        <div className="compose-header" onClick={() => setIsMinimized(m => !m)}>
            <span className="compose-title">
                {subject.trim() || 'New Message'}
            </span>
            <div className="compose-header-btns" onClick={ev => ev.stopPropagation()}>
                <button
                    className="compose-ctrl"
                    onClick={() => setIsMinimized(m => !m)}
                    title={isMinimized ? 'Expand' : 'Minimize'}
                >
                    <i className={isMinimized ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'}></i>
                </button>
                <button className="compose-ctrl close-btn" onClick={onClose} title="Close">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>

        {!isMinimized && <React.Fragment>
            <div className="compose-fields">
                <div className="compose-field">
                    <label>From</label>
                    <span className="from-field">{loggedInUser.email}</span>
                </div>
                <div className="compose-field">
                    <label>To</label>
                    <input
                        type="text"
                        value={to}
                        onChange={ev => setTo(ev.target.value)}
                        placeholder="Recipients"
                        autoFocus
                    />
                </div>
                <div className="compose-field">
                    <label>Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={ev => setSubject(ev.target.value)}
                        placeholder="Subject"
                    />
                </div>
            </div>

            <textarea
                className="compose-body"
                value={body}
                onChange={ev => setBody(ev.target.value)}
                placeholder="Write your message..."
            />

            <div className="compose-footer">
                <button
                    className="send-btn"
                    onClick={onSend}
                    disabled={!to.trim() || isSent}
                >
                    {isSent ? '✓ Sent!' : 'Send'}
                </button>
                <button className="discard-btn" onClick={onClose} title="Discard draft">
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </React.Fragment>}
    </div>
}
