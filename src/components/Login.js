import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import firestore from '../config/firebaseConfig';

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = () => {
    props.isUserProp(true);
  }

  const setAdmin = () => {
    props.isAdminProp(true);
  }

  const onLogin = () => {
    setLoading(true)
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        try {
          const queryStatement = query(collection(firestore, 'users'), where('uid', '==', userId));
          const querySnapshot = await getDocs(queryStatement);
          const usersRole = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (usersRole[0].role === "user") {
            setUser();
          } else if (usersRole[0].role === "admin") {
            setAdmin();
          }
        } catch (e) {
          alert(e.message);
        }
      })
      .catch(e => alert(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-96 bg-white shadow-lg p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
            type="email"
            className="border-2 rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            name="password"
            type="password"
            className="border-2 rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <button
            onClick={onLogin}
            className="bg-blue-500 text-white px-10 py-2 rounded text-xl font-bold w-full"
          >
            {loading ? 'Logging you in ...' : 'Login'}
          </button>
        </div>
        <div className="text-center">
          <Link to="/signup" className="text-blue-500">Don't have an account?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
