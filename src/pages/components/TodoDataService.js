// TodoDataService.js - Centralized data management for Todo application

const LOCAL_STORAGE_KEYS = {
    TASKS: 'todoTasks',
    DONE_TASKS: 'todoDoneTasks',
    CATEGORIES: 'todoCategories'
  };
  
  // Custom events for components to communicate
  const EVENTS = {
    TASKS_UPDATED: 'todoTasksUpdated',
    DONE_TASKS_UPDATED: 'todoDoneTasksUpdated',
    CATEGORIES_UPDATED: 'todoCategoriesUpdated'
  };
  
  // Helper function to dispatch custom events
  const notifyUpdate = (eventName) => {
    window.dispatchEvent(new CustomEvent(eventName));
  };
  
  // Helper functions for localStorage operations
  const getItem = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return defaultValue;
    }
  };
  
  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  };
  
  // Task management
  const TaskService = {
    getTasks: () => getItem(LOCAL_STORAGE_KEYS.TASKS, []),
    
    saveTasks: (tasks) => {
      const result = setItem(LOCAL_STORAGE_KEYS.TASKS, tasks);
      if (result) notifyUpdate(EVENTS.TASKS_UPDATED);
      return result;
    },
    
    addTask: (task) => {
      const tasks = TaskService.getTasks();
      const newTask = {
        ...task,
        id: task.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      
      const updatedTasks = [...tasks, newTask];
      return TaskService.saveTasks(updatedTasks);
    },
    
    updateTask: (taskId, updatedData) => {
      const tasks = TaskService.getTasks();
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedData } : task
      );
      
      return TaskService.saveTasks(updatedTasks);
    },
    
    removeTask: (taskId) => {
      const tasks = TaskService.getTasks();
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      return TaskService.saveTasks(updatedTasks);
    }
  };
  
  // Done tasks management
  const DoneTaskService = {
    getDoneTasks: () => getItem(LOCAL_STORAGE_KEYS.DONE_TASKS, []),
    
    saveDoneTasks: (doneTasks) => {
      const result = setItem(LOCAL_STORAGE_KEYS.DONE_TASKS, doneTasks);
      if (result) notifyUpdate(EVENTS.DONE_TASKS_UPDATED);
      return result;
    },
    
    addDoneTask: (task) => {
      const doneTasks = DoneTaskService.getDoneTasks();
      const updatedDoneTasks = [...doneTasks, task];
      return DoneTaskService.saveDoneTasks(updatedDoneTasks);
    },
    
    removeDoneTask: (taskId) => {
      const doneTasks = DoneTaskService.getDoneTasks();
      const updatedDoneTasks = doneTasks.filter(task => task.id !== taskId);
      return DoneTaskService.saveDoneTasks(updatedDoneTasks);
    },
    
    // Move task from active to done
    markTaskAsDone: (taskId) => {
      const tasks = TaskService.getTasks();
      const taskToMove = tasks.find(task => task.id === taskId);
      
      if (!taskToMove) {
        console.error(`Task with ID ${taskId} not found`);
        return false;
      }
      
      // Add to done tasks
      DoneTaskService.addDoneTask(taskToMove);
      
      // Remove from active tasks
      return TaskService.removeTask(taskId);
    }
  };
  
  // Category management
  const CategoryService = {
    getCategories: () => {
      const defaultCategories = ["ALL", "WORK", "CAPSTONE", "ACADS"];
      const categories = getItem(LOCAL_STORAGE_KEYS.CATEGORIES, defaultCategories);
      
      // Ensure ALL is always present and first
      if (!categories.includes("ALL")) {
        categories.unshift("ALL");
      }
      
      return categories;
    },
    
    saveCategories: (categories) => {
      const result = setItem(LOCAL_STORAGE_KEYS.CATEGORIES, categories);
      if (result) notifyUpdate(EVENTS.CATEGORIES_UPDATED);
      return result;
    },
    
    addCategory: (category) => {
      if (!category || category.trim() === "") return false;
      if (category === "ALL") return false; // Reserved name
      
      const categories = CategoryService.getCategories();
      if (categories.includes(category)) return false;
      
      const updatedCategories = [...categories, category];
      return CategoryService.saveCategories(updatedCategories);
    }
  };
  
  // Subscribe to events
  const subscribeToUpdates = (eventName, callback) => {
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  };
  
  // Export all services
  const TodoDataService = {
    TaskService,
    DoneTaskService,
    CategoryService,
    EVENTS,
    subscribeToUpdates
  };
  
  export default TodoDataService;