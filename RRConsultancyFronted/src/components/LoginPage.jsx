import { useFormik } from 'formik';
import './LoginPage.css';
import { useNavigate, Link } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(`${apiUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        const data = await response.json();

        if (response.ok && data.user?.token) {
          localStorage.setItem('token', data.user.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          alert('Login successful!');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          alert(data.message || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="login-container">
      <div className="login-box">
        
          

        <div className="login-right">
          <img
            src="https://i.imgur.com/hrUQKKx.png"
            alt="Ramul Logo"
            className="logo"
          />
          <h2>Login</h2>
          <form onSubmit={formik.handleSubmit}>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
          <p><Link to="/">Home Page</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
