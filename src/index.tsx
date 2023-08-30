import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import App from './App';

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>,
    rootElement
);
