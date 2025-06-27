import React, { useState } from 'react'
import api from '../api'

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    if (!username || !password || (mode === 'register' && !confirmPassword)) {
      setError("Please fill all fields")
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (mode === 'login') {
        const res = await api.post("/auth/login", { username, password })
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          onLogin()
        } else {
          setError("No token received from server")
        }
      } else {
        const res = await api.post("/auth/register", { username, password })
        setSuccess("Registration successful! You can now login.")
        setMode('login')
        setUsername("")
        setPassword("")
        setConfirmPassword("")
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error || `${mode} failed`
        setError(message)
      } else if (err.request) {
        setError("Cannot connect to server. Please check if the backend is running.")
      } else {
        setError(`${mode} failed: ` + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const inputStyle = {
    marginBottom: '16px',
    padding: '12px',
    border: '1px solid #d1c4e9',
    borderRadius: '8px',
    fontSize: '15px',
    background: '#fff',
    transition: 'border 0.2s ease',
    outline: 'none'
  }

  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #fbeaff, #f0e7f6)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.75)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#5c007a'
        }}>
          {mode === 'login' ? '🔐 Welcome' : '📝 Register'}
        </h2>

        {error && (
          <div style={{
            color: '#8b0000',
            backgroundColor: '#fdecea',
            border: '1px solid #f3bcbc',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: 'green',
            backgroundColor: '#e6ffe6',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          style={inputStyle}
        />

        {mode === 'register' && (
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            style={inputStyle}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#b39ddb' : '#7e57c2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
        >
          {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
        </button>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError("")
            setSuccess("")
          }}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '12px',
            backgroundColor: '#ec407a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
        >
          {mode === 'login' ? 'Create Account' : 'Back to Login'}
        </button>

        <div style={{
          marginTop: '22px',
          fontSize: '13px',
          color: '#555',
          textAlign: 'center'
        }}>
          🌐 Backend URL: <span style={{ color: '#5e35b1', fontWeight: 'bold' }}>http://localhost:4000/api</span>
        </div>
      </div>
    </div>
  )
}