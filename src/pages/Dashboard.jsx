
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "./components/Navbar";
import QuoteComponent from "./components/QuoteComponent";
import ToDoList from "./components/TodoList";
import DoneTasks from "./components/DoneTask";
import PhTimeDisplay from "./components/PhTimeDisplay";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
     
      navigate('/');
      return;
    }
    
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {

    localStorage.removeItem('currentUser');
   
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="DashboardContainer">

      <div className="DashboardContent">
        <h1 className="DashboardTitle">MOMENTUM</h1>
        <p className="DashboardSubtitle">{user.userName}, Your Productivity is in Motion</p>
        <div className="DashboardMain">
        
          <div className="DashboardRight">
            <ToDoList />
          </div>
          <div className="DashboardLeft">
            <PhTimeDisplay />
            <QuoteComponent />
            <DoneTasks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
