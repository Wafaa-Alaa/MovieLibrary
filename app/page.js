'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserRegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false
  });

 
  useEffect(() => {
    const newErrors = { ...errors };
    let hasChanges = false;

    if (touched.username && formData.username.length >= 3 && errors.username) {
      delete newErrors.username;
      hasChanges = true;
    }

    if (touched.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && errors.email) {
      delete newErrors.email;
      hasChanges = true;
    }

    if (touched.password && formData.password.length >= 6 && errors.password) {
      delete newErrors.password;
      hasChanges = true;
    }

    if (hasChanges) {
      setErrors(newErrors);
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
   
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error || undefined
    }));
  };

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate all fields first
  validateField('username', formData.username);
  validateField('email', formData.email);
  validateField('password', formData.password);
  
  // Check if there are any errors
  const hasErrors = 
    !formData.username || formData.username.length < 3 ||
    !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
    !formData.password || formData.password.length < 6;
  
  if (!hasErrors) {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/movies');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {}),
                ...(touched.username && !errors.username ? styles.inputValid : {})
              }}
              placeholder="Enter your username"
            />
            {errors.username && <span style={styles.error}>{errors.username}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
                ...(touched.email && !errors.email ? styles.inputValid : {})
              }}
              placeholder="Enter your email"
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
                ...(touched.password && !errors.password ? styles.inputValid : {})
              }}
              placeholder="Enter your password"
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {})
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span style={styles.spinner}></span>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#555',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    transition: 'all 0.3s',
  },
  inputError: {
    borderColor: '#e74c3c',
    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)',
  },
  inputValid: {
    borderColor: '#2ecc71',
    boxShadow: '0 0 0 2px rgba(46, 204, 113, 0.2)',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.8rem',
    marginTop: '0.2rem',
    height: '0.8rem',
  },
  button: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
};

export default UserRegistrationForm;