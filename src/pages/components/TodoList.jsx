import { useState, useEffect } from "react";
import TodoDataService from "./TodoDataService";
import "./ToDo.css";


const ToDoList = () => {

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  

  useEffect(() => {
  
    loadTasks();
    loadCategories();
    

    const unsubscribeTasks = TodoDataService.subscribeToUpdates(
      TodoDataService.EVENTS.TASKS_UPDATED,
      loadTasks
    );
    
    const unsubscribeCategories = TodoDataService.subscribeToUpdates(
      TodoDataService.EVENTS.CATEGORIES_UPDATED,
      loadCategories
    );
    
    
    return () => {
      unsubscribeTasks();
      unsubscribeCategories();
    };
  }, []);
  
 
  useEffect(() => {
    console.log("Initial load - tasks:", TodoDataService.TaskService.getTasks());
    console.log("Initial load - doneTasks:", TodoDataService.DoneTaskService.getDoneTasks());
  }, []);
  
  const loadTasks = () => {
    setTasks(TodoDataService.TaskService.getTasks());
  };
  
  const loadCategories = () => {
    setCategories(TodoDataService.CategoryService.getCategories());
  };
  
  
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAddOrUpdateTask = () => {
    if (task && date) {
    
      if (category && !categories.includes(category) && category !== "ALL") {
        TodoDataService.CategoryService.addCategory(category);
      } else if (category === "ALL") {
        alert("'ALL' is a reserved category name and cannot be used.");
        return;
      }
      
      const taskData = {
        title: task,
        date: date,
        description: description,
        category: category || "Uncategorized"
      };
      
      if (isEditing && editingTaskId) {
       
        TodoDataService.TaskService.updateTask(editingTaskId, taskData);
        setIsEditing(false);
        setEditingTaskId(null);
      } else {
      
        TodoDataService.TaskService.addTask(taskData);
      }
      
      
      setTask("");
      setDate("");
      setDescription("");
      setCategory("");
      setShowModal(false);
      
     
    }
  };

  const handleEditTask = (taskToEdit) => {
    setIsEditing(true);
    setEditingTaskId(taskToEdit.id);
    setTask(taskToEdit.title);
    setDate(taskToEdit.date);
    setDescription(taskToEdit.description || "");
    setCategory(taskToEdit.category || "");
    setShowModal(true);
  };

  const markAsDone = (taskId) => {
    TodoDataService.DoneTaskService.markTaskAsDone(taskId);
    

  };

  const filterTasks = (categoryFilter) => {
    setActiveFilter(categoryFilter);
  };

  const filteredTasks = activeFilter === "ALL" 
    ? tasks
    : tasks.filter(task => task.category === activeFilter);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setTask("");
    setDate("");
    setDescription("");
    setCategory("");
  };
  

  const removeTask = (taskId) => {
    TodoDataService.TaskService.removeTask(taskId);
    

  };
  
  
  const removeCategory = (categoryToRemove) => {
    if (categoryToRemove === "ALL" || categoryToRemove === "Uncategorized") {
      alert("Cannot remove the default categories.");
      return;
    }
    
    
    if (window.confirm(`Are you sure you want to remove the category "${categoryToRemove}"? Tasks in this category will be moved to "Uncategorized".`)) {

      const tasksInCategory = tasks.filter(task => task.category === categoryToRemove);
      tasksInCategory.forEach(task => {
        TodoDataService.TaskService.updateTask(task.id, {
          ...task,
          category: "Uncategorized"
        });
      });
      
  
      TodoDataService.CategoryService.removeCategory(categoryToRemove);
      
     
      if (activeFilter === categoryToRemove) {
        setActiveFilter("ALL");
      }
    }
  };
  

  const getCategoriesWithTasks = () => {
    const usedCategories = ["ALL"]; 
    
   
    tasks.forEach(task => {
      if (!usedCategories.includes(task.category)) {
        usedCategories.push(task.category);
      }
    });
    
    return usedCategories;
  };
  

  const categoriesWithTasks = getCategoriesWithTasks();

  return (
    <div className="ToDoContainer">
      <h2 className="ToDoTitle">TASKS TO DO:</h2>
      
      <div className="FolderContainer">
        <div className="FolderTabs">
          {categoriesWithTasks.map((cat, index) => (
            <div key={cat} className="FolderTabContainer">
              <button 
                className={`FolderTab ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => filterTasks(cat)}
                style={{ 
                  zIndex: categoriesWithTasks.length - index,
                  left: `${index * 50}px`
                }}
              >
                {cat}
              </button>
              {cat !== "ALL" && (
                <button 
                  className="RemoveCategoryBtn"
                  onClick={() => removeCategory(cat)}
                  title={`Remove ${cat} category`}
                >
                  REMOVE CATEGORY
                </button>
              )}
            </div>
          ))}
          <button 
            className="FolderTab AddTaskTab" 
            onClick={() => setShowModal(true)}
            style={{ 
              zIndex: 0,
              left: `${categoriesWithTasks.length * 50}px`
            }}
          >
            ADD TASK
          </button>
        </div>
        <div className="FolderContent">
          <div className="TasksGrid ScrollableTasksGrid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task.id} className="TaskCard">
                  <button 
                    className="CloseTaskBtn" 
                    onClick={() => removeTask(task.id)}
                  >✕</button>
                  <h3 className="TaskTitle">{task.title}</h3>
                  <div className="TaskCategory">{task.category}</div>
                  
                  <div className="TaskDate">{task.date}</div>
                  <div className="TaskDescription">
                    <p>Description:</p>
                    <p>{task.description}</p>
                  </div>
                  <div className="TaskActions">
                    <button className="EditBtn" onClick={() => handleEditTask(task)}>EDIT</button>
                    <button className="DoneBtn" onClick={() => markAsDone(task.id)}>DONE</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="EmptyState">No tasks in this category</div>
            )}
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <h3 className="ModalTitle">{isEditing ? "Edit Task" : "Add Task"}</h3>
            <div className="ModalForm">
              <div className="ModalTaskTitle">
              <div className="InputGroup">
                <label>TASK TITLE :</label>
                <input 
                  type="text" 
                  value={task} 
                  onChange={(e) => setTask(e.target.value)} 
                  placeholder="TASK TITLE"
                />
              </div>
              <div className="InputGroup">
                <label>Date Due:</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  placeholder="Date"
                />
                </div>
                </div>
              <div className="InputGroup">
                <label>Category</label>
                <div className="CategoryInputContainer">
                  <input
                    type="text"
                    className="CategoryInput"
                    list="categories-list"
                    value={category}
                    onChange={handleCategoryChange}
                    placeholder="Select or type new category"
                  />
                  <datalist id="categories-list">
                    {categories
                      .filter(cat => cat !== "ALL") 
                      .map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </datalist>
                </div>
                <small className="InputHelper">
                  Type a new category name or select an existing one. New categories will be added when you add the task.
                </small>
              </div>
              <div className="InputGroup">
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Description"
                />
              </div>
              <div className="ModalButtons">
                <button className="CloseBtn" onClick={handleCloseModal}>X Close</button>
                <button className="AddTaskBtn" onClick={handleAddOrUpdateTask}>
                  {isEditing ? "UPDATE TASK" : "ADD TASK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoList;