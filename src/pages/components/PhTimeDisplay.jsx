import React, { useState, useEffect } from 'react';
import './PhTimeDisplay.css';

const PhTimeDisplay = () => {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState('AM');

 
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
    
      const phTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
      
      let hours = phTime.getHours();
      const minutes = phTime.getMinutes();
      

      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      
      setHour(hours);
      setMinute(minutes);
      setPeriod(ampm);
    };

  
    updateTime();
    
    
    const intervalId = setInterval(updateTime, 1000);
    
   
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="PhTimeContainer">
      <div className="PhTimeHeader">
        <span className="PhTimeIcon">⏱</span>
        <span className="PhTimeTitle">Philippine Standard Time</span>
      </div>
      
      <div className="PhTimeDisplay">
        <div className="PhTimeBox PhTimeHour">
          {hour.toString().padStart(2, '0')}
          <div className="PhTimeLabel">Hour</div>
        </div>
        
        <div className="PhTimeSeparator">:</div>
        
        <div className="PhTimeBox PhTimeMinute">
          {minute.toString().padStart(2, '0')}
          <div className="PhTimeLabel">Minute</div>
        </div>
        
        <div className="PhTimePeriodContainer">
          <button 
            className={`PhTimePeriodButton ${period === 'AM' ? 'PhTimePeriodActive' : ''}`}
            onClick={() => setPeriod('AM')}
          >
            AM
          </button>
          <button 
            className={`PhTimePeriodButton ${period === 'PM' ? 'PhTimePeriodActive' : ''}`}
            onClick={() => setPeriod('PM')}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhTimeDisplay;