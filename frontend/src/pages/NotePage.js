import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as LogOut } from '../assets/logout.svg';
import axios from 'axios';

const NotePage = ({ getNotes }) => {
    const { id: noteId } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState({ body: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        noteId === 'new' ? setNote({ body: '' }) : fetchNote();
    }, [noteId]);

    const fetchNote = async () => {
        const response = await fetch(`/api/notes/${noteId}/`);
        const data = await response.json();
        setNote(data);
    };

    const saveNote = async () => {
        const method = noteId === 'new' ? 'POST' : 'PUT';
        const endpoint = noteId === 'new' ? '/api/notes/' : `/api/notes/${noteId}/`;
        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });

        if (response.ok) {
            const savedNote = noteId === 'new' ? await response.json() : note;
            navigate(`/note/${savedNote.id || noteId}`);
        }
    };

    const deleteNote = async () => {
        await fetch(`/api/notes/${noteId}/`, { method: 'DELETE' });
        navigate('/');
    };

    const handleNoteChange = (e) => {
        setNote({ ...note, body: e.target.value });
    };

    const handleLogout = async () => {

        try {

            const response = await fetch('/api/logout_view/', {
                method: 'POST'
            });
            console.log(response);

            localStorage.removeItem('token');
            setIsLoggedIn(false);

        }
        catch (error) {
            console.log("An Error occurred:", error);
        }
    };



    return (
        <div className="note">
            <div className="note-header">
                <button onClick={noteId !== 'new' ? deleteNote : saveNote}>
                    {noteId !== 'new' ? 'Delete' : 'Done'}
                </button>
                <div className='logout'>
                    <button onClick={handleLogout}>
                        <LogOut></LogOut>
                    </button>

                </div>
            </div>
            <textarea onChange={handleNoteChange} value={note.body}></textarea>
        </div>
    );
}

export default NotePage;
