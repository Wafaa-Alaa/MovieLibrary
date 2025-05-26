'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGithub, FaSpinner } from 'react-icons/fa';

const RegisterPage = () => {
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
  const [githubLoading, setGithubLoading] = useState(false);

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
    
    validateField('username', formData.username);
    validateField('email', formData.email);
    validateField('password', formData.password);
    
    const hasErrors = 
      !formData.username || formData.username.length < 3 ||
      !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      !formData.password || formData.password.length < 6;
    
    if (!hasErrors) {
      setIsSubmitting(true);
      try {
        const result = await signIn('credentials', {
          redirect: false,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          callbackUrl: '/movies'
        });

        if (result?.error) {
          console.error('Registration error:', result.error);
        } else {
          router.push('/movies');
        }
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    try {
      await signIn('github', { 
        callbackUrl: '/movies',
        redirect: true 
      });
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setGithubLoading(false);
    }
  };

 
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '3rem 1rem',
    },
    card: {
      maxWidth: '28rem',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '2rem',
    },
    title: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '1.875rem',
      fontWeight: '800',
      color: '#1f2937',
    },
    dividerContainer: {
      position: 'relative',
      margin: '1.5rem 0',
    },
    dividerLine: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
    },
    dividerText: {
      position: 'relative',
      padding: '0 0.5rem',
      backgroundColor: 'white',
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    form: {
      marginTop: '2rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      transition: 'all 0.2s',
      outline: 'none',
    },
    inputError: {
      borderColor: '#f87171',
      boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
    },
    inputValid: {
      borderColor: '#34d399',
      boxShadow: '0 0 0 2px rgba(52, 211, 153, 0.2)',
    },
    errorText: {
      marginTop: '0.25rem',
      fontSize: '0.75rem',
      color: '#ef4444',
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    githubButton: {
      backgroundColor: '#1f2937',
      color: 'white',
      marginBottom: '1rem',
      '&:hover': {
        backgroundColor: '#111827',
      },
    },
    registerButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      '&:hover': {
        backgroundColor: '#2563eb',
      },
      '&:disabled': {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    icon: {
      marginRight: '0.5rem',
    },
    spinner: {
      animation: 'spin 1s linear infinite',
    },
    footerText: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '1rem',
    },
    link: {
      fontWeight: '500',
      color: '#3b82f6',
      cursor: 'pointer',
      '&:hover': {
        color: '#2563eb',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create your account</h2>

        <button
          onClick={handleGitHubSignIn}
          disabled={githubLoading}
          style={{ 
            ...styles.button, 
            ...styles.githubButton,
            opacity: githubLoading ? 0.7 : 1
          }}
        >
          {githubLoading ? (
            <>
              <FaSpinner style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
              Signing in with GitHub...
            </>
          ) : (
            <>
              <FaGithub style={styles.icon} />
              Sign up with GitHub
            </>
          )}
        </button>

        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine}>
            <div style={{ width: '100%', borderTop: '1px solid #d1d5db' }}></div>
          </div>
          <div style={styles.dividerText}>Or register with email</div>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
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
            {errors.username && <p style={styles.errorText}>{errors.username}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
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
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
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
            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...styles.button, ...styles.registerButton }}
          >
            {isSubmitting ? (
              <>
                <FaSpinner style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
                Registering...
              </>
            ) : 'Register'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <span 
            onClick={() => router.push('/movies')}
            style={styles.link}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;