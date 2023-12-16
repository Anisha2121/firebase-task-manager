import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import firestore from '../config/firebaseConfig';


const Signup = (props ) => {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const setUser = () => {
        props.isUserProp(true);
    }

    const onSignup = () => {
        setLoading(true);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            try {
                const docRef = await addDoc(collection(firestore, 'users'), {
                  uid: userId,
                  role: "user",
                });
                const docId = docRef.id;
                if(docId) {
                    setUser();
                } else {
                    console.log("doc id is null");
                }
              } catch (e) {
                console.error('Error adding document: ', e);
              }
        })
        .catch((e) => {
            alert(e.message);
            setLoading(false);
        });
    }


    return (
        <div className="w-full h-screen bg-gradient-to-r from-yellow-200 via-red-500 to-pink-500 flex justify-center items-center">
            <div className="w-96 bg-white shadow-lg">
                <div className="m-5">
                    <label className="block text-xl font-bold mb-2">Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        name="name"
                        type="name"
                        className="border-grey-200 border-2 rounded w-full p-2 h-10"
                    />
                </div>
                <div className="m-5">
                    <label className="block text-xl font-bold mb-2">Email</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        className="border-grey-200 border-2 rounded w-full p-2 h-10"
                    />
                </div>
                <div className="m-5">
                    <label className="block text-xl font-bold mb-2">Password</label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        name="password"
                        type="password"
                        className="border-grey-200 border-2 rounded w-full p-2 h-10"
                    />
                </div>
                <div className="m-5">
                    <button
                        onClick={onSignup}
                        className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-10 py-2 rounded text-xl font-bold"
                    >
                        { loading ? 'Creating user ...' : 'Signup'}
                    </button>
                </div>
                <div className="m-5">
                    <Link to="/">
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup;