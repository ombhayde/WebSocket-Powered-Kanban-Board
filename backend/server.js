const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// In-memory task storage
let tasks = {
  todo: [],
  inProgress: [],
  done: []
};

// Generate unique IDs for tasks
const generateId = () => Math.random().toString(36).substr(2, 9);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send all tasks to newly connected client
  socket.emit("sync:tasks", tasks);

  // Create a new task
  socket.on("task:create", (task) => {
    const newTask = {
      id: generateId(),
      ...task,
      createdAt: new Date().toISOString(),
      attachments: task.attachments || []
    };
    
    tasks[task.status || "todo"].push(newTask);
    
    // Broadcast the new task to all clients
    io.emit("sync:tasks", tasks);
  });

  // Update an existing task
  socket.on("task:update", (updatedTask) => {
    const { id, status } = updatedTask;
    const column = status || Object.keys(tasks).find(col => 
      tasks[col].some(task => task.id === id)
    );
    
    if (column) {
      const taskIndex = tasks[column].findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        tasks[column][taskIndex] = {
          ...tasks[column][taskIndex],
          ...updatedTask,
          updatedAt: new Date().toISOString()
        };
        io.emit("sync:tasks", tasks);
      }
    }
  });

  // Move a task between columns
  socket.on("task:move", ({ taskId, fromStatus, toStatus }) => {
    if (tasks[fromStatus] && tasks[toStatus]) {
      const taskIndex = tasks[fromStatus].findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        const task = tasks[fromStatus][taskIndex];
        
        // Remove from source column
        tasks[fromStatus].splice(taskIndex, 1);
        
        // Add to target column
        tasks[toStatus].push({
          ...task,
          status: toStatus,
          updatedAt: new Date().toISOString()
        });
        
        io.emit("sync:tasks", tasks);
      }
    }
  });

  // Delete a task
  socket.on("task:delete", ({ taskId, status }) => {
    const column = status || Object.keys(tasks).find(col => 
      tasks[col].some(task => task.id === taskId)
    );
    
    if (column) {
      tasks[column] = tasks[column].filter(task => task.id !== taskId);
      io.emit("sync:tasks", tasks);
    }
  });

  // Handle file uploads (simulated)
  socket.on("task:upload", ({ taskId, status, file }) => {
    const column = status || Object.keys(tasks).find(col => 
      tasks[col].some(task => task.id === taskId)
    );
    
    if (column) {
      const taskIndex = tasks[column].findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        if (!tasks[column][taskIndex].attachments) {
          tasks[column][taskIndex].attachments = [];
        }
        
        tasks[column][taskIndex].attachments.push({
          id: generateId(),
          filename: file.name,
          url: `simulated-url/${file.name}`, // Simulated URL
          uploadedAt: new Date().toISOString()
        });
        
        io.emit("sync:tasks", tasks);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

server.listen(5000, () => console.log("Server running on port 5000"));