import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import firestore from '../config/firebaseConfig';

const Signup = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = () => {
    props.isUserProp(true);
  }

  const onSignup = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      const docRef = await addDoc(collection(firestore, 'users'), {
        uid: userId,
        role: "user",
        name: name,
      });

      const docId = docRef.id;
      if (docId) {
        setUser();
      } else {
        console.log("doc id is null");
      }
    } catch (e) {
      console.error('Error creating user: ', e.message);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-96 bg-white shadow-lg p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
            type="name"
            className="border-2 rounded w-full p-2"
          />
        </div>
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
            onClick={onSignup}
            className="bg-blue-500 text-white px-10 py-2 rounded text-xl font-bold w-full"
          >
            {loading ? 'Creating user ...' : 'Signup'}
          </button>
        </div>
        <div className="text-center">
          <Link to="/" className="text-blue-500">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
