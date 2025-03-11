import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
  
    if (!userName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    

    if (users.some(user => user.email === email)) {
      setError('Email already registered');
      return;
    }
    
  
    const newUser = {
      id: Date.now().toString(),
      userName,
      email,
      password
    };
    
    
    users.push(newUser);
    
    
    localStorage.setItem('users', JSON.stringify(users));
    
    
    navigate('/login');
  };

  return (
    <div className="registration-container">
      <div className="registration-content">
        <div className="RegisterLogoSection">
          <h1 className="logo">MOMENTUM</h1>
          <p className="tagline">Your Productivity, In Motion</p>
        </div>
        
        <div className="registration-form-section">
          <h2 className="RegistrationFormTitle">REGISTRATION FORM</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userName">UserName</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
               
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
               
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;