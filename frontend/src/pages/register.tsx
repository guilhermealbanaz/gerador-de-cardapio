import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';
import { useRouter } from 'next/router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(name, email, password);
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div>
          <h2 className={styles.title}>Crie sua conta</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ou{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              faça login se já tiver uma conta
            </Link>
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="name" className="sr-only">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} mb-2`}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
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
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} mb-2`}
                placeholder="Senha"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirme a senha
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirme a senha"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>Ou</span>
            <div className={styles.dividerLine}></div>
          </div>

          <div className="text-center">
            <Link href="/login" className={styles.link}>
              Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
