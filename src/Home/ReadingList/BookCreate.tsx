import { useState } from "react";
import './BookCreate.scss'

const BookCreate = ({ onCreate }:any) => {
    const [bookTitle, setBookTitle] = useState('');

    const handleChange = (event:any) => {
        setBookTitle(event.target.value)
    }

    const handleSubmit = (event:any) => {
        event.preventDefault();
        onCreate(bookTitle);
        setBookTitle('');
    }

    return (
        <div className="book-create">
            <h3>Add a Book</h3>
            <form onSubmit={ handleSubmit }>
                <label>Title</label>
                <input className="input" type="text" value={ bookTitle } onChange={ handleChange }/>
                <button className="button">Create!</button>
            </form>
        </div>
    )
}

export default BookCreate;