import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types'

//import axios from 'axios';

// same as calling props param, but deconstructing in parameters to pull just props.setAlert
// Redux actions 'setAlert' and 'register'
const Register = ({setAlert, register}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async e => {
    e.preventDefault();
    if(password !== password2) {
      setAlert('Passwords do not match.', 'danger', 3500);
    } else {
      register({name,email,password});
    }
  }

  return <Fragment>
    <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={ e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" onChange={e => onChange(e)} value={name} 
          required 
          />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} 
          required
          />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            onChange={e => onChange(e)}
            value={password}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In!</Link>
      </p>
  </Fragment>
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
}

// Redux actions 'setAlert' and 'register'
export default connect(null, {setAlert, register})(Register);

/* const oldOnSubmit = async e => {
  e.preventDefault();
  if(password !== password2) {
    console.log('Passwords do not match');
  } else {
    const newUser = {
      name,
      email,
      password
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const body = JSON.stringify(newUser);
      // Can put "/api/users" because of proxy config in package.json
      const res = await axios.post('/api/users', body, config);
      console.log(res.data);
    } catch (err) {
      console.log(err.message)
    }
  }
}*/
