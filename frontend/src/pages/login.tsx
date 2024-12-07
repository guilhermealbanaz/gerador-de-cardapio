import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div>
          <h2 className={styles.title}>Sign in to your account</h2>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.input} mb-2`}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button type="submit" className={styles.button}>
              Sign in
            </button>
          </div>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>Or</span>
            <div className={styles.dividerLine}></div>
          </div>

          <div className="text-center">
            <Link href="/register" className={styles.link}>
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
