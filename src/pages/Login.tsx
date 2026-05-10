import React, { useEffect } from 'react';
import styles from './Login.module.css';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigation will be handled by the useEffect above when the user state updates
    } catch (error) {
      console.error('Login failed', error);
    }
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
          <button className={styles.googleBtn} onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            <span>Sign in with Google</span>
          </button>
          
          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
