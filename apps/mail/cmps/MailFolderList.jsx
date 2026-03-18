import { mailService } from '../services/mail.service.js'

const { useState, useEffect } = React

const FOLDERS = [
    { key: 'inbox',   label: 'Inbox',   icon: 'fa-solid fa-inbox' },
    { key: 'starred', label: 'Starred', icon: 'fa-solid fa-star' },
    { key: 'sent',    label: 'Sent',    icon: 'fa-solid fa-paper-plane' },
    { key: 'draft',   label: 'Draft',   icon: 'fa-regular fa-file' },
    { key: 'trash',   label: 'Trash',   icon: 'fa-solid fa-trash' },
]

export function MailFolderList({ activeFolder, onSelectFolder }) {
    const [counts, setCounts] = useState({})

    useEffect(() => {
        // Count unread per folder
        Promise.all(
            FOLDERS.map(f =>
                mailService.query({ status: f.key }).then(mails => ({
                    key: f.key,
                    count: mails.filter(m => !m.isRead).length
                }))
            )
        ).then(results => {
            const newCounts = {}
            results.forEach(r => { newCounts[r.key] = r.count })
            setCounts(newCounts)
        })
    }, [activeFolder])

    return <nav className="mail-folder-list">
        {FOLDERS.map(folder =>
            <div
                key={folder.key}
                className={`folder-item ${activeFolder === folder.key ? 'active' : ''}`}
                onClick={() => onSelectFolder(folder.key)}
            >
                <i className={folder.icon}></i>
                <span className="folder-label">{folder.label}</span>
                {counts[folder.key] > 0 &&
                    <span className="folder-badge">{counts[folder.key]}</span>
                }
            </div>
        )}
    </nav>
}
