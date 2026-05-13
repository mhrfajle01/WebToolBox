import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { auth } from '../lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Wrench, Loader2, Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, sendPasswordReset } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

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
    } catch (error) {
      const err = error as Error;
      console.error('Login failed', err);
      toast.error(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    
    setIsSendingReset(true);
    try {
      await sendPasswordReset(email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      const err = error as Error;
      console.error('Reset password error', err);
      toast.error(err.message || 'Failed to send reset email.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoggingIn(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Auth error', err);
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass animate-fade-in`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Wrench size={40} color="var(--accent-primary)" />
          </div>
          <h1>{isSignUp ? 'Create Account' : 'Welcome to WebToolBox'}</h1>
          <p>{isSignUp ? 'Join the premium utility suite.' : 'The ultimate premium utility suite.'}</p>
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
            <span>{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>
          
          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {isSignUp && (
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className={styles.input} 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className={styles.input} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="Password" 
                className={styles.input} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {!isSignUp && (
              <button 
                type="button" 
                className={styles.forgotPassword}
                onClick={handleForgotPassword}
                disabled={isSendingReset}
              >
                {isSendingReset ? 'Sending...' : 'Forgot Password?'}
              </button>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus size={20} />
                      <span>Create Account</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className={styles.toggleMode}>
            {isSignUp ? (
              <p>Already have an account? <button onClick={() => setIsSignUp(false)}>Sign In</button></p>
            ) : (
              <p>Don't have an account? <button onClick={() => setIsSignUp(true)}>Sign Up</button></p>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <p>By continuing, you agree to our <span>Terms of Service</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
