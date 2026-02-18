import { useState } from 'react';
import './SearchBar.scss'

const SearchBar = ({onSearchSubmit}: any) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: any) => {
        event.preventDefault();
        onSearchSubmit(searchTerm)
    }

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value);
    }

    return (
        <div className="search-bar">
            <form onSubmit={handleSearch}>
                <label>Enter Search Term</label>
                <input  name="searchTerm" type="text" value={ searchTerm } onChange={ handleChange } />
            </form>
        </div>
    )
}
// value={ searchTerm }

export default SearchBar;

// Handling text inputs:
// Create a new piece of State 
// Create event handler to watch for onChange event 
// When onChange fires get the value from the input 
// take the value from the input and update your state
// Pass your state into the input as the value prop
