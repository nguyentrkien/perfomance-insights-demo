import React, { useState } from 'react';
import './Login.scss';
import Header from './Header';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from 'store/auth';
import { useEffect } from 'react';

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const accessToken = useSelector(state => state.auth.login.currentUser?.accessToken);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(null)
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Login logic here
    loginUser({
      email: `${email}`,
      password: `${password}`
    }, history, dispatch)
      .then(data => {
        setErrorMessage(data);
      })
  };

  const handleToggle = (e) => {
    history.push("/register")
  }

  useEffect(()=>{
    if(accessToken)
    {
      console.log(accessToken);
      history.push("/admin/device");
    }
  },[])

  return (<>
    <Header></Header>
    <div className='background'>
    <div className="login">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label className='error'>{errorMessage}</label>
        </div>
        <button type="submit" className="btn">
          Login
        </button>
        <button type='button' onClick={handleToggle} className="toggle-btn">
          Create an account
        </button>
      </form>
    </div>
    </div>
  </>
  );
};

export default Login;