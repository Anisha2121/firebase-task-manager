import { getAuth, signOut } from '@firebase/auth';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from '@firebase/firestore';
import firestore from '../config/firebaseConfig';

const AdminDashboard = (props) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    projectId: '',
    taskName: '',
    startDate: '',
    endDate: '',
    priority: '',
    status: '',
    assignee: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const setAdmin = () => {
    props.isAdminProp(false);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('token');
        setAdmin();
      })
      .catch((e) => alert(e.message));
  };

  const createTask = async () => {
    try {
      const tasksCollection = collection(firestore, 'tasks');
      const newTaskRef = await addDoc(tasksCollection, newTask);
      setTasks([...tasks, { id: newTaskRef.id, ...newTask }]);
      setNewTask({
        projectId: '',
        taskName: '',
        startDate: '',
        endDate: '',
        priority: '',
        status: '',
        assignee: '',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  const auth = getAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(firestore, 'tasks');
        const tasksSnapshot = await getDocs(tasksCollection);
        const tasksData = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 via-red-500 to-pink-500 flex flex-col items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-8 py-3 rounded-full text-lg font-bold mb-6 w-full"
        >
          Logout
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Task List:</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Project ID</th>
                <th className="border p-3">Task Name</th>
                <th className="border p-3">Start Date</th>
                <th className="border p-3">End Date</th>
                <th className="border p-3">Priority</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Assignee</th>
                <th className="border p-3">Edit</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="text-center">
                  <td className="border p-3">{task.projectId}</td>
                  <td className="border p-3">{task.taskName}</td>
                  <td className="border p-3">{task.startDate}</td>
                  <td className="border p-3">{task.endDate}</td>
                  <td className="border p-3">{task.priority}</td>
                  <td className="border p-3">{task.status}</td>
                  <td className="border p-3">{task.assignee}</td>
                  <td className="border p-3">
                    <button
                     // onClick={() => handleEdit(task.id)} // Implement handleEdit
                      className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-4 py-2 rounded-full text-sm font-bold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {showCreateForm ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Create Task</h2>
              <form>
                <label className="block mb-2">
                  Project ID:
                  <input
                    type="text"
                    name="projectId"
                    value={newTask.projectId}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  />
                </label>
                <label className="block mb-2">
                 Task Name
                  <input
                    type="text"
                    name="taskName"
                    value={newTask.taskName}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  />
                </label>
                <label className="block mb-2">
                  Start Date:
                  <input
                    type="date"
                    name="startDate"
                    value={newTask.startDate}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  />
                </label>
                <label className="block mb-2">
                  End Date:
                  <input
                    type="date"
                    name="endDate"
                    value={newTask.endDate}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  />
                </label>
                <label className="block mb-2">
                  Priority:
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <label className="block mb-2">
                  Status:
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  >
                    <option value="">Select Status</option>
                    <option value="todo">To-Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <label className="block mb-2">
                  Assignee:
                  <input
                    type="text"
                    name="assignee"
                    value={newTask.assignee}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  />
                </label>
                <button
                  type="button"
                  onClick={createTask}
                  className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-6 py-2 rounded-full text-lg font-bold"
                >
                  Create Task
                </button>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-8 py-3 rounded-full text-lg font-bold"
            >
              Open Create Task Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
