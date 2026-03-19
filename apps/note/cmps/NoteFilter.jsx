const { useState, useEffect } = React

export function NoteFilter({ onSetFilterBy, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        if (target.type === 'number') value = +value

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onClearFilter(ev) {
        ev.preventDefault()
        setFilterByToEdit({ txt: '' })
    }

    return (
        <section className="note-filter">
            <form onSubmit={(ev) => ev.preventDefault()}>
                <label htmlFor="txt">Search Notes:</label>
                <input
                    type="text"
                    id="txt"
                    name="txt"
                    placeholder="Search by title or content..."
                    value={filterByToEdit.txt || ''}
                    onChange={handleChange}
                />
                <button onClick={onClearFilter} type="button">Clear</button>
            </form>
        </section>
    )
}