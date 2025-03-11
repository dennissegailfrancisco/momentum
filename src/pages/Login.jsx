import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
  
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      
     
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
    
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="logo-section">
          <h1 className="logoTitle">MOMENTUM</h1>
          <p className="tagline">Your Productivity, In Motion</p>
        </div>
        
        <div className="login-form-section">
          <h2 className="LogInFormTitle">LOG IN</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Passsword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="sign-in-btn">Sign In</button>
            
            <div className="action-links">
              
              <Link to="/register" className="signup-btn">Dont Have An Account? Click Here to Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;