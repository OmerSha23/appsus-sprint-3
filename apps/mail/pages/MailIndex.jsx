
const { useState, useEffect, useCallback } = React
const { useSearchParams } = ReactRouterDOM
import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailDetails } from '../cmps/MailDetails.jsx'

export function MailIndex() {
    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())
    const [selectedMail, setSelectedMail] = useState(null)
    const [isComposing, setIsComposing] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const folder = searchParams.get('folder')
        if (folder) setFilterBy(prev => ({ ...prev, status: folder }))
    }, [])

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy).then(setMails)
    }

    function onSetFilter(newFilter) {
        setFilterBy(prev => ({ ...prev, ...newFilter }))
        setSelectedMail(null)
    }

    function onSelectFolder(folder) {
        setFilterBy(mailService.getDefaultFilter({ status: folder }))
        setSelectedMail(null)
    }

    function onSelectMail(mail) {
        if (!mail.isRead) {
            const updated = { ...mail, isRead: true }
            mailService.save(updated).then(() => {
                setMails(prev => prev.map(m => m.id === mail.id ? updated : m))
                setSelectedMail(updated)
            })
        } else {
            setSelectedMail(mail)
        }
    }

    function onRemoveMail(mailId) {
        const mail = mails.find(m => m.id === mailId)
        if (mail.isTrash) {
            mailService.remove(mailId).then(loadMails)
        } else {
            const updated = { ...mail, isTrash: true, removedAt: Date.now() }
            mailService.save(updated).then(loadMails)
        }
        setSelectedMail(null)
    }

    function onToggleStar(mail, ev) {
        ev.stopPropagation()
        const updated = { ...mail, isStared: !mail.isStared }
        mailService.save(updated).then(() => {
            setMails(prev => prev.map(m => m.id === mail.id ? updated : m))
            if (selectedMail && selectedMail.id === mail.id) setSelectedMail(updated)
        })
    }

    function onToggleRead(mail, ev) {
        ev && ev.stopPropagation()
        const updated = { ...mail, isRead: !mail.isRead }
        mailService.save(updated).then(() => {
            setMails(prev => prev.map(m => m.id === mail.id ? updated : m))
            if (selectedMail && selectedMail.id === mail.id) setSelectedMail(updated)
        })
    }

    function onSendMail(newMail) {
        mailService.save(newMail).then(() => {
            setIsComposing(false)
            if (filterBy.status === 'sent') loadMails()
        })
    }

    function onSaveDraft(draftMail) {
        mailService.save(draftMail).then(() => {
            if (filterBy.status === 'draft') loadMails()
        })
    }

    function onNavigateMail(mailId) {
        mailService.get(mailId).then(mail => {
            if (!mail.isRead) {
                const updated = { ...mail, isRead: true }
                mailService.save(updated).then(() => setSelectedMail(updated))
            } else {
                setSelectedMail(mail)
            }
        })
    }

    const unreadCount = mails ? mails.filter(m => !m.isRead).length : 0

    return <div className="mail-index">
        <aside className="mail-sidebar">
            <button className="compose-btn" onClick={() => setIsComposing(true)}>
                <i className="fa-solid fa-pen-to-square"></i>
                <span>Compose</span>
            </button>
            <MailFolderList
                activeFolder={filterBy.status}
                onSelectFolder={onSelectFolder}
            />
        </aside>

        <main className="mail-main">
            <MailFilter
                filterBy={filterBy}
                onSetFilter={onSetFilter}
            />

            <div className="mail-content">
                {!selectedMail
                    ? <MailList
                        mails={mails}
                        filterBy={filterBy}
                        onSelectMail={onSelectMail}
                        onRemoveMail={onRemoveMail}
                        onToggleStar={onToggleStar}
                        onToggleRead={onToggleRead}
                    />
                    : <MailDetails
                        mail={selectedMail}
                        onBack={() => setSelectedMail(null)}
                        onRemoveMail={onRemoveMail}
                        onToggleStar={onToggleStar}
                        onNavigateMail={onNavigateMail}
                        onCompose={() => setIsComposing(true)}
                    />
                }
            </div>
        </main>

        {isComposing && <MailCompose
            onSendMail={onSendMail}
            onSaveDraft={onSaveDraft}
            onClose={() => setIsComposing(false)}
        />}
    </div>
}
