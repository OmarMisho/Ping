import { useState } from 'react';
import { loginOwner, registerOwner } from '../firebase';
import BrandMark from '../components/BrandMark';

export default function OwnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      if (isRegistering) {
        await registerOwner(email, password);
      } else {
        await loginOwner(email, password);
      }

      window.location.href = '/owner';
    } catch (err: any) {
      console.error(err);

      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-chrome flex items-center justify-center p-5">
      <div className="w-full max-w-[400px] bg-white border border-line rounded-[20px] p-8">
        <div className="flex items-center gap-3 mb-6">
          <BrandMark size={40} />
          <div>
            <h1 className="text-lg font-bold text-ink leading-none">Founder</h1>
            <p className="text-xs text-ink-muted mt-1">Owner access</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-ink mb-5">
          {isRegistering ? 'Create Owner Account' : 'Owner Login'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-3 border border-line rounded-xl text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-founder-deep"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-3 border border-line rounded-xl text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-founder-deep"
        />

        {error && (
          <div className="text-red-600 text-sm mb-3">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-founder text-ink rounded-xl font-bold border border-white transition hover:brightness-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Please wait...'
            : isRegistering
              ? 'CREATE ACCOUNT'
              : 'LOGIN'}
        </button>

        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
          className="w-full mt-3 py-3 bg-transparent border-none text-ink-muted text-sm cursor-pointer hover:text-ink transition-colors"
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'Create a new owner account'}
        </button>
      </div>
    </div>
  );
}
