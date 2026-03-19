import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

export const mailService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyMail,
    getLoggedInUser,
}

const MAIL_KEY = 'Mail_DB'

export const loggedInUser = {
    email: 'user@appsus.com',
    fullName: 'Mahatma Appsus',
}

if (!utilService.loadFromStorage(MAIL_KEY)) {
    _createMails()
}

function getLoggedInUser() {
    return loggedInUser
}

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY).then((mails) => {
        const { status, txt, isRead, isStared } = filterBy

        if (status === 'inbox') {
            mails = mails.filter(m => m.to === loggedInUser.email && !m.isTrash && !m.isDraft)
        } else if (status === 'sent') {
            mails = mails.filter(m => m.from === loggedInUser.email && !m.isTrash && !m.isDraft)
        } else if (status === 'trash') {
            mails = mails.filter(m => m.isTrash)
        } else if (status === 'draft') {
            mails = mails.filter(m => m.isDraft && !m.isTrash)
        } else if (status === 'starred') {
            mails = mails.filter(m => m.isStared && !m.isTrash)
        }

        if (txt) {
            const regExp = new RegExp(txt, 'i')
            mails = mails.filter(m =>
                regExp.test(m.from) ||
                regExp.test(m.to) ||
                regExp.test(m.subject) ||
                regExp.test(m.body)
            )
        }

        if (isRead === true) mails = mails.filter(m => m.isRead)
        if (isRead === false) mails = mails.filter(m => !m.isRead)
        if (isStared === true) mails = mails.filter(m => m.isStared)

        mails.sort((a, b) => b.createdAt - a.createdAt)
        return mails
    })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId).then(mail => {
        return _setNextPrevMail(mail)
    })
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) return storageService.put(MAIL_KEY, mail)
    else return storageService.post(MAIL_KEY, mail)
}

function getDefaultFilter(filterBy = {}) {
    return {
        status: filterBy.status || 'inbox',
        txt: filterBy.txt || '',
        isRead: filterBy.isRead !== undefined ? filterBy.isRead : null,
        isStared: filterBy.isStared || false,
    }
}

function getEmptyMail() {
    return {
        from: loggedInUser.email,
        to: '',
        subject: '',
        body: '',
        isRead: false,
        isStared: false,
        isTrash: false,
        isDraft: false,
        isSent: true,
        createdAt: Date.now(),
        sentAt: null,
        removedAt: null,
        labels: [],
    }
}

function _setNextPrevMail(mail) {
    return storageService.query(MAIL_KEY).then(mails => {
        const idx = mails.findIndex(m => m.id === mail.id)
        mail.nextMailId = mails[idx + 1] ? mails[idx + 1].id : mails[0].id
        mail.prevMailId = mails[idx - 1] ? mails[idx - 1].id : mails[mails.length - 1].id
        return mail
    })
}

function _createMails() {
    const mails = [
        { id: 'e101', createdAt: Date.now() - 1000*60*30, subject: 'Miss you!', body: 'Would love to catch up sometime. It has been way too long. Let me know when you are free!', isRead: false, isStared: true, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'momo@momo.com', to: 'user@appsus.com', labels: ['personal'] },
        { id: 'e102', createdAt: Date.now() - 1000*60*60*2, subject: 'Q3 Design Review - your feedback needed', body: 'Hi,\n\nHope all is well! I have finished the Q3 design review document and would love your feedback before the Friday presentation.\n\nKey areas:\n- The new onboarding flow (pages 4-7)\n- Color palette updates\n- Mobile layout proposals\n\nBest, Sarah', isRead: false, isStared: false, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'sarah.j@example.com', to: 'user@appsus.com', labels: ['work'] },
        { id: 'e103', createdAt: Date.now() - 1000*60*60*5, subject: 'Pull request #42 merged', body: 'A pull request was merged into main.\n\nPR #42: feat: add dark mode toggle\nMerged by: alex-dev\n\nView the changes on GitHub.', isRead: true, isStared: false, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'noreply@github.com', to: 'user@appsus.com', labels: [] },
        { id: 'e104', createdAt: Date.now() - 1000*60*60*24, subject: 'Re: Project proposal - looks great!', body: 'Hey!\n\nJust went through the proposal. This is some of your best work. Scope is clear, timeline is realistic, pricing is fair.\n\nReady to sign off whenever you are. Cheers, Marcus', isRead: true, isStared: true, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'marcus@designstudio.io', to: 'user@appsus.com', labels: ['work'] },
        { id: 'e105', createdAt: Date.now() - 1000*60*60*48, subject: 'Your weekly digest is ready', body: 'Hello,\n\nHere is what happened this week:\n- 10 CSS tricks you did not know\n- React 19 new features explained\n- Building accessible UIs\n\nSee you next week!', isRead: true, isStared: false, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'digest@newsletter.io', to: 'user@appsus.com', labels: [] },
        { id: 'e106', createdAt: Date.now() - 1000*60*60*72, subject: 'Hey there honey', body: 'Just wanted to check in! How are you doing? Let us get dinner soon.', isRead: false, isStared: false, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'old@man.com', to: 'user@appsus.com', labels: ['personal'] },
        { id: 'e107', createdAt: Date.now() - 1000*60*60*96, subject: "Let's go shopping", body: 'Found some amazing sales this weekend. Want to come along? We could grab lunch after too!', isRead: true, isStared: true, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'gal@pal.com', to: 'user@appsus.com', labels: ['personal'] },
        { id: 'e108', createdAt: Date.now() - 1000*60*60*120, subject: 'My dog died', body: 'This has been the worst week. I cannot believe she is gone. She was the best dog ever. I am devastated.', isRead: true, isStared: false, isTrash: false, isDraft: false, sentAt: null, removedAt: null, from: 'gal@momo.com', to: 'user@appsus.com', labels: [] },
        { id: 'e109', createdAt: Date.now() - 1000*60*45, subject: 'Re: Q3 Design Review', body: 'Hi Sarah,\n\nThanks for sharing! I will take a look this afternoon.\n\nBest, Mahatma', isRead: true, isStared: false, isTrash: false, isDraft: false, sentAt: Date.now() - 1000*60*44, removedAt: null, from: 'user@appsus.com', to: 'sarah.j@example.com', labels: [] },
        { id: 'e110', createdAt: Date.now() - 1000*60*60*3, subject: 'Team sync agenda for Thursday', body: 'Hi everyone,\n\nHere is the agenda:\n1. Sprint retrospective\n2. Q2 planning\n3. Open discussion\n\nSee you there! Mahatma', isRead: true, isStared: false, isTrash: false, isDraft: false, sentAt: Date.now() - 1000*60*60*3, removedAt: null, from: 'user@appsus.com', to: 'team@company.com', labels: ['work'] },
        { id: 'e111', createdAt: Date.now() - 1000*60*10, subject: 'Draft: follow up with client', body: 'Hi,\n\nJust wanted to follow up on our last conversation...', isRead: true, isStared: false, isTrash: false, isDraft: true, sentAt: null, removedAt: null, from: 'user@appsus.com', to: 'client@biz.com', labels: [] },
        { id: 'e112', createdAt: Date.now() - 1000*60*60*200, subject: 'You have WON $1,000,000!!', body: 'CONGRATULATIONS! Click now to claim your prize. This is totally real.', isRead: false, isStared: false, isTrash: true, isDraft: false, sentAt: null, removedAt: Date.now() - 1000*60*60*100, from: 'winner@notscam.xyz', to: 'user@appsus.com', labels: [] },
    ]
    utilService.saveToStorage(MAIL_KEY, mails)
}
