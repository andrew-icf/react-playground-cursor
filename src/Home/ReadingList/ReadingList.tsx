import { useState } from 'react';
import BookCreate from './BookCreate';
import './ReadingList.scss';

const ReadingList = () => {
    const [books, setBooks] = useState([]);

    const createBook = (title:any) => {
        console.log('Adding book with title', title)
    }

    return (
        <div>
            <h1>Reading List</h1>
            <BookCreate onCreate={ createBook }/>
        </div>
    )
}

export default ReadingList;