import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Använd rätt sökväg
import '../css/Navbar.css'


const Navbar = () => {
    const { isLoggedIn, login, logout } = useAuth();

    return (
        <div>
            <nav className="navbar">
                <li>
                    <Link to="/">Hem</Link>
                </li>
                <li>
                    <Link to="/AddProduct">Lägg till produkt</Link>
                </li>
                <li>
                    <Link to="/Basket">Korg</Link>
                </li>
                {isLoggedIn ? (
                    <>
                        <li>
                            <Link to="/profile">Min profil</Link>
                        </li>
                        <li>
                            <button className="logout-button" onClick={logout}>Logga ut</button>
                        </li>
                    </>
                ) : (
                    <li>
                        <button className="login-button" onClick={login}>Logga in</button>
                    </li>
                )}
            </nav>
        </div>
    );
};

export default Navbar;