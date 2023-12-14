import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';
import  db  from '../config/firebaseConfig';  
import { ref, set } from 'firebase/database';


const Signup = (props ) => {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);

    // useEffect(() => {
    //     const token = localStorage.getItem('token');

    //     if (token) {
    //         history.push('/dashboard')
    //     }
    // },[history])
    const setUser = () => {
        props.isUserProp(true);
    }
    const onSignup = () => {
        setLoading(true);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {setUser()
        //     const user = userCredential.user;
        //     const uid = user.uid;

        //     // Write user data to the Realtime Database
        //     const userRef = ref(db, `Users/${uid}`);
        //     set(userRef, {
        //         email: email,
        //         displayName: name,
        //     })
        //     .then(() => {
        //         updateProfile(auth.currentUser, { displayName: name })
        //             .then(() => history.push('/'))
        //             .catch((e) => alert(e.message));
        //     })
        //     .catch((e) => alert(e.message))
        //     .finally(() => setLoading(false));
        //
     }
        )
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