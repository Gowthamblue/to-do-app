import { useEffect, useState } from 'react';

function Dashboard() {
  const user_id = localStorage.getItem("user_id");
  const user_name = localStorage.getItem("user_name");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", desc: "" });

  const API_BASE = import.meta.env.VITE_API_BASE;

  // Fetch user tasks
  useEffect(() => {
    fetch(`${API_BASE}/tasks/${user_id}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, [user_id]);

  // Add new task
  const handleAddTask = () => {
    fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        task_title: newTask.title,
        task_desc: newTask.desc,
      }),
    })
      .then(() => {
        setNewTask({ title: "", desc: "" });
        return fetch(`${API_BASE}/tasks/${user_id}`);
      })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  return (
    <div>
      <div style={{ float: "right", margin: "10px" }}>
        Logged in as <strong>{user_name}</strong>
      </div>

      <h2>📝 Your Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.task_id}>
            <strong>{task.task_title}</strong>: {task.task_desc}
          </li>
        ))}
        
      </ul>

      <h3>Add Task</h3>
      <input
        placeholder="Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={newTask.desc}
        onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
}

export default Dashboard;
