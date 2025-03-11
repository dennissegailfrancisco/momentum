import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./pages/components/Navbar";
import Dashboard from "./pages/Dashboard";
import FocusMode from "./pages/FocusMode";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const currentUser = localStorage.getItem('currentUser');
    setIsLoggedIn(!!currentUser);
  }, []);


  const handleLoginStatusChange = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <div>
    
      {isLoggedIn && <Navbar onLogout={() => handleLoginStatusChange(false)} />}
      
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={() => handleLoginStatusChange(true)} />} 
        />
        <Route path="/register" element={<Registration />} />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/focus" 
          element={isLoggedIn ? <FocusMode /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;