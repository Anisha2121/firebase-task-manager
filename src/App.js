import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import firebaseConfig from './config/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';

initializeApp(firebaseConfig);

function App() {

  const navigate = useNavigate();
  const [isUser, setUser] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
        if(isUser) {
          navigate("/dashboard");
        }
    },[])
  return (
    <div className="App">
      <Routes>
          <Route exact path="/" element={<Login isUserProp={setUser}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </div>
  );
}

export default App;
