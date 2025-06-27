import React, { useEffect, useState } from 'react'
import api from '../api'
import dayjs from 'dayjs'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState({ title: "", description: "", Date: "" })

  const loadTodos = async () => {
    const res = await api.get("/todos")
    setTodos(res.data)
  }

  const submit = async () => {
    if (!form.title || !form.description || !form.Date) return

    // Fix: Ensure clean date formatting before sending to backend
    const formattedDate = dayjs(form.Date).format("YYYY-MM-DD")
    await api.post("/todos", { ...form, Date: formattedDate })

    setForm({ title: "", description: "", Date: "" })
    loadTodos()
  }

  const remove = async (id) => {
    await api.delete(`/todos/${id}`)
    loadTodos()
  }

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  useEffect(() => {
    loadTodos()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fefaff',
      padding: '24px'
    }}>
      {/* Top: Form & Todo List */}
      <div style={{ flex: 1 }}>
        <h2 style={{ color: '#5c007a', marginBottom: '20px' }}>📝 My Todos</h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={inputStyle}
          />
          <input
            type="Due date"
            value={form.Date}
            onChange={(e) => setForm({ ...form, Date: e.target.value })}
            style={inputStyle}
          />
          <button onClick={submit} style={addButtonStyle}>Add</button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((t) => (
            <li key={t.id} style={todoItemStyle}>
              <div>
                <strong>{t.title}</strong>
                <p>{t.description}</p>
                <small>Due Date: {dayjs(t.Date).format("YYYY-MM-DD")}</small>
              </div>
              <button onClick={() => remove(t.id)} style={deleteButtonStyle}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: Logout */}
      <button
        onClick={logout}
        style={{
          padding: '12px 20px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          alignSelf: 'center',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
  flex: '1'
}

const addButtonStyle = {
  padding: '10px 16px',
  backgroundColor: '#7e57c2',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '500',
  cursor: 'pointer'
}

const deleteButtonStyle = {
  backgroundColor: '#ef5350',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  alignSelf: 'center',
  marginTop: '8px'
}

const todoItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '14px',
  marginBottom: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
}