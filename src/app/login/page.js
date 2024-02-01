"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from "../context/AuthContext";

const Login = () => {
  const router = useRouter();
	const { user, emailPwSignIn, logOut} = UserAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

	const handleEmailLogin = async (e) => {
    e.preventDefault();
    emailPwSignIn(email, password)
    .then(() => {
      //successfully login
      router.push('/');
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
      {/* <button onClick={handleGoogleLogin}>Login with Google</button> */}
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </div>
  );
};

export default Login;
