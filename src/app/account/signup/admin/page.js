"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from "../../../context/AuthContext";
import { emailPwSignIn, emailPwSignUp, logOut,  googleSignIn } from "../../../../firebase/functions"

const AdminSignup = () => {
  const { user } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

	const handleEmailSignUp = async (e) => {
    e.preventDefault();
    emailPwSignUp(email, password)
    .then(() => {
      //successfully login
      // router.push('/');
      console.log("Sign up")
    })
    .catch((error) => {
      const errorCode = error.code;
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
    </div>
  );
};

export default AdminSignup;
