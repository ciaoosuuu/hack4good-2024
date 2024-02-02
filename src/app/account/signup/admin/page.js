"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from "../../../context/AuthContext";
import { emailPwSignIn, emailPwSignUp, logOut,  googleSignIn } from "../../../../firebase/functions";
import withAuth from '../../../../hoc/withAuth';

const AdminSignup = ({user}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  // console.log("adminsignup");

  // console.log(user?.email);

	const handleEmailSignUp = async (e) => {
    e.preventDefault();
    emailPwSignUp(email, password)
    .then(() => {
      //successfully login
      // router.push('/');
      console.log("Sign up")
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(`Email sign up error: ${errorMessage}`);
      setLoginError(errorMessage);
    });
	};

  const handleGoogleSignUp = async (e) => {
    e.preventDefault();
    googleSignIn()
    .then(() => {
      //successfully login
      // router.push('/');
      console.log("Log in.")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Email login error: ${errorMessage}`);
      setLoginError(errorMessage);
    });
	};

  return (
    <div>
      <h1>Admin Sign Up Page</h1>
      <form onSubmit={handleEmailSignUp}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      <br />
      <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      {!loginError && user && <p style={{ color: 'red' }}>{user.email}</p>}
      {!loginError && user && <p style={{ color: 'red' }}>{user.role}</p>}

    </div>
  );
};

export default withAuth(AdminSignup);
