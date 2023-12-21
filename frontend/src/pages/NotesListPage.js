import React, { useState, useEffect } from 'react';
import ListItem from '../components/ListItem';
import AddButton from '../components/AddButton';

const NotesListPage = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/notes/');
                const fetchedNotes = await res.json();
                setNotes(fetchedNotes);
            } catch (err) {
                console.error('Failed to fetch notes:', err);
            }
        })();
    }, []);

    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className="notes-title">&#9782; Notes</h2>
                <p className="notes-count">{notes.length}</p>
            </div>

            <div className="notes-list">
                {notes.map((note, index) => (
                    <ListItem key={note.id || index} note={note} />
                ))}
            </div>

            <AddButton />
        </div>
    );
};

export default NotesListPage;
