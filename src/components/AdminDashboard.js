import { getAuth, signOut } from '@firebase/auth';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, orderBy,setDoc,doc } from '@firebase/firestore';
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
  const [users, setUsers] = useState([]);
  const [editableTask, setEditableTask] = useState(null);

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
      setEditableTask(null);
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  const handleEdit = (index) => {
    const taskToEdit = { ...tasks[index], index };
    setEditableTask(taskToEdit);
  };
  

  const handleSaveEdit = async () => {
    try {
      
      const editedTask = { ...editableTask };
      const tasksCollection = collection(firestore, 'tasks');
      await setDoc(doc(firestore, 'tasks', tasks[editableTask.index].id), editedTask);
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        updatedTasks[editableTask.index] = editedTask;
        return updatedTasks;
      });
      setEditableTask(null);
    } catch (error) {
      console.error('Error saving edited task:', error.message);
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

    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(query(usersCollection, orderBy('uid')));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        console.log(usersData);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchTasks();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editableTask !== null) {
      setEditableTask((prevTask) => ({ ...prevTask, [name]: value }));
    } else {
      setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
    }
  };

  return ( <>
        
        <button
          onClick={logout}
          className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-bold mb-6 w-small"
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          Logout
        </button>
  
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="">
        <h1 className="text-3xl font-semibold mb-6 text-center">Admin Dashboard</h1>
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
              {tasks.map((task, index) => (
                <tr key={task.id} className="text-center">
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <input type="text" name="projectId" value={editableTask.projectId} onChange={handleInputChange} />
                    ) : (
                      task.projectId
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <input type="text" name="taskName" value={editableTask.taskName} onChange={handleInputChange} />
                    ) : (
                      task.taskName
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <input type="date" name="startDate" value={editableTask.startDate} onChange={handleInputChange} />
                    ) : (
                      task.startDate
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <input type="date" name="endDate" value={editableTask.endDate} onChange={handleInputChange} />
                    ) : (
                      task.endDate
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <select
                        name="priority"
                        value={editableTask.priority}
                        onChange={handleInputChange}
                        className="border rounded w-full p-2"
                      >
                        <option value="">Select Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    ) : (
                      task.priority
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <select
                        name="status"
                        value={editableTask.status}
                        onChange={handleInputChange}
                        className="border rounded w-full p-2"
                      >
                        <option value="">Select Status</option>
                        <option value="todo">To-Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <select
                        name="assignee"
                        value={editableTask.assignee}
                        onChange={handleInputChange}
                        className="border rounded w-full p-2"
                      >
                        <option value="">Select Assignee</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.name}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      task.assignee
                    )}
                  </td>
                  <td className="border p-3">
                    {editableTask && editableTask.index === index ? (
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                      >
                        Edit
                      </button>
                    )}
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
              <form onSubmit={createTask}>
                <label className="block mb-2">
                  Project ID:
                  <input 
                   required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  <select
                  required
                    name="assignee"
                    value={editableTask ? editableTask.assignee : newTask.assignee}
                    onChange={handleInputChange}
                    className="border rounded w-full p-2"
                  >
                    <option value="">Select Assignee</option>
                    {users &&
                      users.map((user) => (
                        <option key={user.id} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </label>
                <button
                  type="submit"
                  
                  className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-bold"
                >
                  Create Task
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-bold"
                >
                  cancel Task
                </button>
                
              </form>
            </div>
          ) : (
            
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-bold"
                >
                  Create Task Form
                </button>
               
          

                
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
