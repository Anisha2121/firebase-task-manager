import React, { useEffect, useState } from 'react';
import {
  getAuth,
  signOut
} from '@firebase/auth';
import {
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc
} from '@firebase/firestore';
import firestore from '../config/firebaseConfig';

const UserDashboard = (props) => {
  const [userTasks, setUserTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [editedRemark, setEditedRemark] = useState('');

  const setUser = () => {
    props.isUserProp(false);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('token');
        setUser();
      })
      .catch((e) => alert(e.message));
  };

  const auth = getAuth();

  const handleEditClick = (taskId, currentStatus, currentRemark) => {
    setEditingTaskId(taskId);
    setEditedStatus(currentStatus);
    setEditedRemark(currentRemark);
  };

  const handleRemarkClick = (taskId, currentRemark) => {
    setEditingTaskId(taskId);
    setEditedRemark(currentRemark);
  };

  const handleRemarkChange = (newRemark) => {
    setEditedRemark(newRemark);
  };

  const handleStatusChange = (newStatus) => {
    setEditedStatus(newStatus);
  };

  const handleSaveClick = async (taskId) => {
    try {
      const taskRef = doc(firestore, 'tasks', taskId);

      if (editedStatus && editingTaskId) {
        // Update the status in the Firestore database
        await updateDoc(taskRef, {
          status: editedStatus,
        });

        // Update the local state with the edited status
        setUserTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: editedStatus,
                }
              : task
          )
        );
      }

      if (editedRemark && editingTaskId) {
        // Update the remark in the Firestore database
        await updateDoc(taskRef, {
          remark: editedRemark,
        });

        // Update the local state with the edited remark
        setUserTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  remark: editedRemark,
                }
              : task
          )
        );
      }

      // Clear the editing state
      setEditingTaskId(null);
      setEditedStatus('');
      setEditedRemark('');
    } catch (error) {
      console.error('Error updating task status and remark:', error.message);
    }
  };

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const user = auth.currentUser;
        const usersCollection = collection(firestore, 'users');
        const userQuery = query(usersCollection, where('uid', '==', user.uid));
        const usersSnapshot = await getDocs(userQuery);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const tasksCollection = collection(firestore, 'tasks');
        const userTasksQuery = await query(tasksCollection, where('assignee', '==', usersData[0].name));
        const userTasksSnapshot = await getDocs(userTasksQuery);
        const userTasksData = userTasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserTasks(userTasksData);
      } catch (error) {
        console.error('Error fetching user tasks:', error.message);
      }
    };

    fetchUserTasks();
  }, [auth]);

  return (
    <>
      <button
        onClick={logout}
        className="bg-blue-500 text-white px-5 py-2 rounded-semi text-lg font-bold mb-6 w-small"
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        Logout
      </button>
      <div className="w-full h-screen bg-gray-100 flex flex-col">
        <header className="bg-blue-500 text-white py-2">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">User Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto mt-1 flex justify-center">
          <div className="bg-white p-4 rounded shadow mt-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-2 px-4">Project ID</th>
                  <th className="py-2 px-4">Task Name</th>
                  <th className="py-2 px-4">Start Date</th>
                  <th className="py-2 px-4">End Date</th>
                  <th className="py-2 px-4">Priority</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Assignee</th>
                  <th className="py-2 px-4">Remark</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userTasks.map((task) => (
                  <tr key={task.id} className="text-center">
                    <td className="border py-2 px-4">{task.projectId}</td>
                    <td className="border py-2 px-4">{task.taskName}</td>
                    <td className="border py-2 px-4">{task.startDate}</td>
                    <td className="border py-2 px-4">{task.endDate}</td>
                    <td className="border py-2 px-4">{task.priority}</td>
                    <td className="border py-2 px-4">
                      {editingTaskId === task.id ? (
                        <select
                          value={editedStatus}
                          onChange={(e) => handleStatusChange(e.target.value)}
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                          <option value="to do">To Do</option>
                        </select>
                      ) : (
                        task.status
                      )}
                    </td>
                    <td className="border py-2 px-4">{task.assignee}</td>
                    <td className="border py-2 px-4">
                      {task.endDate < new Date().toISOString() ? (
                        <>
                          {editingTaskId === task.id ? (
                            <textarea
                              value={editedRemark}
                              onChange={(e) => handleRemarkChange(e.target.value)}
                              className="border rounded p-1 w-full"
                              rows={3}
                            />
                          ) : (
                            task.remark
                          )}
                          {!task.remark && !editingTaskId && (
                            <button
                              onClick={() => handleRemarkClick(task.id, task.remark)}
                              className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                              disabled={editingTaskId === task.id}
                            >
                              Add Remarks
                            </button>
                          )}
                        </>
                      ) : (
                        task.remark
                      )}
                    </td>
                    <td className="border py-2 px-4">
                      <button
                        onClick={() => handleEditClick(task.id, task.status, task.remark)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit 
                      </button>
                      {editingTaskId === task.id && (
                        <button
                          onClick={() => handleSaveClick(task.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                        >
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
