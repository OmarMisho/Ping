import { useState } from 'react';
import { loginOwner, registerOwner } from '../firebase';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        background: '#f5f7fa',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'white',
          padding: 30,
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <h1>SafeReach</h1>

        <h2>
          {isRegistering ? 'Create Owner Account' : 'Owner Login'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 12,
            boxSizing: 'border-box',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 12,
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <div
            style={{
              color: '#c62828',
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            cursor: loading ? 'default' : 'pointer',
          }}
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
          style={{
            width: '100%',
            marginTop: 12,
            padding: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'Create a new owner account'}
        </button>
      </div>
    </div>
  );
}