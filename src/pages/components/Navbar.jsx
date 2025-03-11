import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import momentumLogo from "./momentumlogo.png"; 

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('currentUser');
    

    if (onLogout) {
      onLogout();
    }
    

    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/dashboard">
          <img src={momentumLogo} alt="Momentum Logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/focus">Focus Mode</Link>
        <button onClick={handleLogout} className="LogoutBtn">Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;