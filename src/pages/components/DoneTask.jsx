import { useState, useEffect } from "react";
import TodoDataService from "./TodoDataService";
import "./DoneTask.css";

const DoneTasks = () => {
  const [doneTasks, setDoneTasks] = useState([]);
  

  useEffect(() => {
    
    loadDoneTasks();
    

    const unsubscribe = TodoDataService.subscribeToUpdates(
      TodoDataService.EVENTS.DONE_TASKS_UPDATED,
      loadDoneTasks
    );
    

    return unsubscribe;
  }, []);
  
  const loadDoneTasks = () => {
    setDoneTasks(TodoDataService.DoneTaskService.getDoneTasks());
  };
  
  const removeDoneTask = (taskId) => {
    TodoDataService.DoneTaskService.removeDoneTask(taskId);

  };
  
  return (
    <div className="DoneTasksContainer">
      
      <h2 className="DoneTasksTitle">COMPLETED TASKS:</h2>
   
      <div className="DoneTasksGrid">
        <div className="ScrollableTasksGrid">
          {doneTasks.length > 0 ? (
            doneTasks.map((task) => (
              <div key={task.id} className="DoneTaskCard">
                <button 
                  className="RemoveDoneTaskBtn" 
                  onClick={() => removeDoneTask(task.id)}
                >✕</button>
                <h3 className="DoneTaskTitle">{task.title}</h3>
                <div className="DoneTaskCategory">{task.category}</div>
                <div className="DoneTaskDate">{task.date}</div>
              </div>
            ))
          ) : (
            <div className="EmptyState">No completed tasks yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoneTasks;