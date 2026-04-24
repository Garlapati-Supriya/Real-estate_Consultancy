import React from 'react';
import { useFormik } from 'formik';
import './Signup.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      phonenumber: '',
    },
    validate: values => {
      const errors = {};

      if (!values.username) errors.username = 'Username required';
      if (!values.email) errors.email = 'Email required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email address';

      if (!values.password) errors.password = 'Password required';

      if (!values.phonenumber) errors.phonenumber = 'Phone number required';
      else if (!/^\d{10}$/.test(values.phonenumber)) errors.phonenumber = 'Phone number should be 10 digits';

      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch(`${apiUrl}/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        const result = await response.json();

        if (response.ok) {
          alert('Signup successful!');
          resetForm();
        } else {
          alert(result.message || 'Signup failed');
        }
      } catch (err) {
        alert('Server error. Try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="container">
      <h1>User Signup</h1>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.errors.username && <div className="error">{formik.errors.username}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && <div className="error">{formik.errors.email}</div>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && <div className="error">{formik.errors.password}</div>}

        <input
          type="text"
          name="phonenumber"
          placeholder="Phone Number"
          onChange={formik.handleChange}
          value={formik.values.phonenumber}
        />
        {formik.errors.phonenumber && <div className="error">{formik.errors.phonenumber}</div>}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Signup;
