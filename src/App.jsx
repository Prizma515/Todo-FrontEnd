import React, { useState } from 'react'
import LoginPage from './pages/LoginPage'
import TodoPage from './pages/TodoPage'
import LogoutPage from './pages/LogoutPage'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"))
  return loggedIn ? <TodoPage /> : <LoginPage onLogin={() => setLoggedIn(true)} />
}