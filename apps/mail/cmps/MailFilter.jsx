const { useState, useEffect, useRef } = React

export function MailFilter({ filterBy, onSetFilter }) {
    const [txt, setTxt] = useState(filterBy.txt || '')
    const debounceRef = useRef(null)

    useEffect(() => {
        setTxt(filterBy.txt || '')
    }, [filterBy.txt])

    function onSearchChange(ev) {
        const val = ev.target.value
        setTxt(val)
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            onSetFilter({ txt: val })
        }, 300)
    }

    function onReadFilter(isRead) {
        onSetFilter({ isRead: filterBy.isRead === isRead ? null : isRead })
    }

    return <div className="mail-filter">
        <div className="filter-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
                type="text"
                placeholder="Search mail"
                value={txt}
                onChange={onSearchChange}
            />
            {txt && <button className="clear-btn" onClick={() => { setTxt(''); onSetFilter({ txt: '' }) }}>
                <i className="fa-solid fa-xmark"></i>
            </button>}
        </div>

        <div className="filter-read-btns">
            <button
                className={`read-filter-btn ${filterBy.isRead === false ? 'active' : ''}`}
                onClick={() => onReadFilter(false)}
                title="Show unread"
            >
                Unread
            </button>
            <button
                className={`read-filter-btn ${filterBy.isRead === true ? 'active' : ''}`}
                onClick={() => onReadFilter(true)}
                title="Show read"
            >
                Read
            </button>
            <button
                className={`read-filter-btn ${filterBy.isRead === null ? 'active' : ''}`}
                onClick={() => onSetFilter({ isRead: null })}
                title="Show all"
            >
                All
            </button>
        </div>
    </div>
}
