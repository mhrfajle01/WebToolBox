import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Wrench, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success('Successfully signed in!');
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error(error.message || 'Login failed. Please check your internet connection and try again.');
      
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized in Firebase. Please add mhrfajle01.github.io to your authorized domains.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Email login is not yet implemented. Please use Google Sign-in.');
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass animate-fade-in`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Wrench size={40} color="var(--accent-primary)" />
          </div>
          <h1>Welcome to WebToolBox</h1>
          <p>The ultimate premium utility suite.</p>
        </div>

        <div className={styles.body}>
          <button 
            className={styles.googleBtn} 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            )}
            <span>{isLoggingIn ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>
          
          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form className={styles.form} onSubmit={handleFormSubmit}>
            <input type="email" placeholder="Email Address" className={styles.input} />
            <input type="password" placeholder="Password" className={styles.input} />
            <button type="submit" className={styles.submitBtn}>Continue</button>
          </form>
        </div>

        <div className={styles.footer}>
          <p>By continuing, you agree to our <span>Terms of Service</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
