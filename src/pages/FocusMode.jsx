import { useState, useEffect } from "react";
import "./FocusMode.css"; 
import QuoteComponent from "./components/QuoteComponent";

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionTime, setSessionTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsBreak((prev) => !prev);

      if (!isBreak) {
        alert("Focus session complete! Time for a break. ☕");
        setTimeLeft(breakTime * 60);
      } else {
        alert("Break over! Let's get back to work. ");
        setTimeLeft(sessionTime * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, sessionTime, breakTime]);

 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="focus-container">
      <h1>{isBreak ? "Break Time " : "Focus Mode "}</h1>
      <h2 className="timer">{formatTime(timeLeft)}</h2>

      <button className="btn" onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button className="btn reset-btn" onClick={() => {
        setIsRunning(false);
        setTimeLeft(sessionTime * 60);
      }}>Reset</button>

      <div className="input-group">
        <label>Work Duration (mins): </label>
        <input
          type="number"
          value={sessionTime}
          onChange={(e) => setSessionTime(Number(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label>Break Duration (mins): </label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(Number(e.target.value))}
        />
      </div>
      <div className="FocusQuoteContainer">
<QuoteComponent />
     </div>
    </div>
  );
};

export default FocusMode;
