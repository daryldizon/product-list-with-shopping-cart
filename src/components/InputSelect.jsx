const InputSelect = ({ value, update, options, isNumber }) => {
    const updateItemsPerPage = (count) => {
        update(count)
    }
    
    return (
       <select className="px-4 py-3 cursor-pointer" value={value} onChange={(e) => updateItemsPerPage(e.target.value) }>
           { !isNumber && (<option value="All">All</option>)}
           {options
            .sort((a, b) => a > b ? 1 : -1)
            .map((option, i) => 
                <option key={i} value={option}>{option}</option>
            )}
       </select>
    )
}

export default InputSelect;
