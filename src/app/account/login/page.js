"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from "../../context/AuthContext";
import { emailPwSignIn, googleSignIn, logOut } from "../../../firebase/functions"

const Login = () => {
  const router = useRouter();
	const { user } = UserAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

	const handleEmailLogin = async (e) => {
    e.preventDefault();
    emailPwSignIn(email, password)
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

  const handleGoogleLogin = async (e) => {
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
      <h1>Login Page</h1>
      <form onSubmit={handleEmailLogin}>
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
        <button type="submit">Login with Email</button>
      </form>
      <br />
      <button onClick={handleGoogleLogin}>Login with Google</button>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      {!loginError && user && <p style={{ color: 'red' }}>{user.email}</p>}
    </div>
  );
};

export default Login;
