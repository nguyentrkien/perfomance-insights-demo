import React, { useState } from 'react';
import './Register.scss';
import Header from './Header';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';
import { resgisterUser } from 'store/auth';

const Register = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Registration logic here
    resgisterUser({
      "email": `${email}`,
      "password": `${password}`,
      "name": `${name}`
    }, history)
     .then(data => setErrorMessage(data))
  };

  const handleToggle = (e) => {
    history.push("/login")
  }

  return (
    <>
    <Header></Header>
    <div className='background'>
    <div className="register">
      <h2 className="title">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="form-control"
            required
          />
        </div>
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
            minLength='5'
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
          Register
        </button>
        <button type='button' onClick={handleToggle} className="toggle-btn">
          Already have an account?
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default Register;