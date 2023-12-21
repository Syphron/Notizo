import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import NotesListPage from './pages/NotesListPage';
import NotePage from './pages/NotePage';
import axios from 'axios';
import Logo from './assets/media/logo.png'


function App() {
    const [notes, setNotes] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { username, password } = formData;


    const getNotes = async () => {
        if (!isLoggedIn) return;

        try {

            let response = await fetch('/api/notes/');
            let data = await response.json();
            setNotes(data);

        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);


    const handleLogin = async () => {
        try {

            const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
            localStorage.setItem('token', response.data.access);

            setIsLoggedIn(true);

        } catch (error) {

            console.error('Login Failed', error);
            setFormData({ username: '', password: '' });
        }
    };


    const Sidebar = () => (
        <div className="sidebar">
            <div className='sidebar-title'>
                <img src={Logo} alt='Notizo'></img>
            </div>
            <NotesListPage notes={notes} getNotes={getNotes} />
        </div>
    );

    const AuthenticatedLayout = ({ children }) => (
        <div className="container">
            <Sidebar />
            <div className="content">
                {children}
            </div>
        </div>
    );


    const onChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    };


    return (
        <Router>
            {!isLoggedIn ? (
                <div className="main-container">
                    <div className="container-login">
                        <div className="title">
                            <p>Log In</p>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                            <div className="container-forms-login">

                                <p>Username</p>
                                <input type="text" name="username" placeholder="Your Username here:" className="forms-field-login" value={username} onChange={onChange} required />

                                <p>Password</p>
                                <input type="password" name="password" placeholder="Your Password here:" className="forms-field-login" value={password} onChange={onChange} required />
                                <button className="forms-field-login submitbutton"><p className="arrow">🡢</p></button>

                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route path="/" element={<AuthenticatedLayout>Welcome to Notizo</AuthenticatedLayout>} />
                    <Route path="/note/:id" element={<AuthenticatedLayout><NotePage getNotes={getNotes} /></AuthenticatedLayout>} />
                </Routes>
            )}
        </Router>
    );
}

export default App;
