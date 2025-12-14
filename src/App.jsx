// src/App.jsx
import React, { useState } from 'react';
import LoginModalWithOTP from './LoginModalWithOTP';
import './App.css';

function App() {
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="app-root">
      <header>
        <h1>Demo: OTP Login</h1>
        {currentUser ? (
          <div>
            <span>Hi, {currentUser.name || currentUser.identifier}</span>
            <button onClick={() => { setCurrentUser(null); localStorage.removeItem('token'); }}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => setShow(true)}>Sign in</button>
        )}
      </header>

      <main>
        <p>Protected content goes here.</p>
      </main>

      {show && (
        <LoginModalWithOTP
          onClose={() => setShow(false)}
          onLogin={(u) => { setCurrentUser(u); setShow(false); }}
        />
      )}
    </div>
  );
}

export default App;
