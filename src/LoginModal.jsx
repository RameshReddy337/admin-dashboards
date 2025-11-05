import React, { useState } from 'react';
import './App.css';

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // after submit, we mark as "logged in" and show details
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with real auth call; this example just mocks success
    const mockUser = {
      name: 'Ramesh Reddy',           // you can replace or fetch actual name
      email: email || 'user@example.com',
      joined: '2024-01-01',
    };
    setUser(mockUser);
    setLoggedIn(true);
    // optionally keep modal open to show details
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    setEmail('');
    setPassword('');
  };

  // close when clicking on overlay (but not when clicking inside modal content)
  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onOverlayClick}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>

        {!loggedIn ? (
          <>
            <h2 id="login-modal-title">Login Details</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required
                />
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn">Sign in</button>
                <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 id="login-modal-title">Login details</h2>
            <div className="login-details">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Joined:</strong> {user?.joined}</p>
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={handleLogout}>Logout</button>
              <button className="btn secondary" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
