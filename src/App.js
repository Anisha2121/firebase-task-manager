import './App.css';
import {Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import { useEffect, useState } from 'react';
import AdminDashboard from './components/AdminDashboard';


function App() {

  const navigate = useNavigate();
  const [isUser, setUser] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
        if(isUser) {
          navigate("/user-dashboard");
        } else if(isAdmin) {
          navigate("/admin-dashboard")
        } else {
          navigate("/")
        }
    },[isUser, isAdmin]);
  
  return (
    <div className="App">
      <Routes>
          <Route exact path="/" element={<Login isUserProp={setUser} isAdminProp={setAdmin}/>} />
          <Route path="/signup" element={<Signup  isUserProp={setUser} isAdminProp={setAdmin}/>} />
          <Route path="/user-dashboard" element={<UserDashboard isUserProp={setUser}/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard isAdminProp={setAdmin}/>} />
        </Routes>
    </div>
  );
}

export default App;
