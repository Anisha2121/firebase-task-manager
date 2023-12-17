import { getAuth, signOut } from '@firebase/auth';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, where, query } from '@firebase/firestore';
import firestore from '../config/firebaseConfig';

const UserDashboard = (props) => {
  const [userTasks, setUserTasks] = useState([]);

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

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const user = auth.currentUser;
        console.log(user)
        const usersCollection = collection(firestore, 'users')
        const userQuery = query(usersCollection, where('uid', '==', user.uid));
        const usersSnapshot = await getDocs(userQuery);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("user name:", usersData);

        const tasksCollection = collection(firestore, 'tasks');
        const userTasksQuery = await query(tasksCollection, where('assignee', '==', usersData[0].name));
        const userTasksSnapshot = await getDocs(userTasksQuery);
        const userTasksData = userTasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("user tasks data:", userTasksData);

        setUserTasks(userTasksData);
      } catch (error) {
        console.error('Error fetching user tasks:', error.message);
      }
    };

    fetchUserTasks();
  }, [auth]);

  return (
    <div className="w-full h-screen bg-gradient-to-r from-yellow-200 via-red-500 to-pink-500 flex justify-center items-center">
      <div className="w-96 bg-white shadow-lg">
        <div className="m-5">
          <p>User Dashboard</p>
        </div>
        <div className="m-5">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-10 py-2 rounded text-xl font-bold"
          >
            Logout
          </button>
        </div>
        <div className="m-5">
          <p>User Tasks:</p>
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
              </tr>
            </thead>
            <tbody>
              {userTasks.map((task) => (
                <tr key={task.id} className="text-center">
                  <td className="border p-3">{task.projectId}</td>
                  <td className="border p-3">{task.taskName}</td>
                  <td className="border p-3">{task.startDate}</td>
                  <td className="border p-3">{task.endDate}</td>
                  <td className="border p-3">{task.priority}</td>
                  <td className="border p-3">{task.status}</td>
                  <td className="border p-3">{task.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
