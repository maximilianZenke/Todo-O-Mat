import React, { useEffect, useState } from 'react'
import { getTodosWithProfiles, toggleTodoDone, updateTodo, deleteTodo, createTodo } from '../api/todoService'
import { getCurrentUserProfile } from '../api/userService'
import { supabase } from '../api/supabaseClient'
import { useNavigate } from 'react-router-dom'
import TodoDetailModal from './TodoDetailModal'
import TodoCreateModal from './TodoCreateModal'
import './Todos.css'

function Todos({ user }) {
  const [todos, setTodos] = useState([])
  const [username, setUsername] = useState(null)
  const [showDone, setShowDone] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()

  function formatDueDate(duedate) {
    const today = new Date()
    const due = new Date(duedate)
    
    // Berechne die Differenz in ganzen Tagen
    const diffTime = due.setHours(0,0,0,0) - today.setHours(0,0,0,0)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Heute'
    if (diffDays > 0) return `In ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`
    return `Vor ${Math.abs(diffDays)} Tag${Math.abs(diffDays) > 1 ? 'en' : ''}`
  }

  function getDueDateClass(duedate) {
  if (!duedate) return ''
  const today = new Date()
  const due = new Date(duedate)
  const diffDays = Math.floor((due.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))

  if (diffDays >= 1) return 'due-green'
  if (diffDays === 0) return 'due-yellow'
  if (diffDays < 0) return 'due-red'
  return ''
}


  const loadTodos = async () => {
    const { data, error } = await getTodosWithProfiles()
    if (!error) setTodos(data)
  }  

  useEffect(() => {
    const fetchData = async () => {
      await loadTodos()
      const { data, error } = await getTodosWithProfiles()
      if (!error) setTodos(data)

      const profile = await getCurrentUserProfile(user.id)
      if (profile?.name) setUsername(profile.name)
    }

    fetchData()
  }, [user.id])

  const filteredTodos = todos.filter(todo => todo.done === showDone)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleCreate = async (todoData) => {
    try {
      const todoWithAuthor = {
        ...todoData,
        author: user.id
      }
      await createTodo(todoWithAuthor)
      await loadTodos()
      setShowCreateModal(false)
    } catch (error) {
      console.error('Fehler beim Erstellen des Todos:', error)
      alert('Fehler beim Erstellen des Todos')
    }
  }

  const handleEdit = async (updates) => {
    try {
      await updateTodo(selectedTodo.id, updates);
      await loadTodos()
      setSelectedTodo(null)
    } catch (error) {
      alert('Fehler beim Bearbeiten des Todos')
    }
  }

  const handleToggleDone = async (todo) => {
    try {
      console.log("todo id: ", todo.id);
      await toggleTodoDone(todo.id, todo.done)
      await loadTodos()
      setSelectedTodo(null)
    } catch (error) {
      alert('Fehler beim Umschalten des Status')
    }
  }
  
  const handleDelete = async (todo) => {
    if (window.confirm(`Möchtest du das Todo "${todo.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      try {
        await deleteTodo(todo.id)
        await loadTodos()
        setSelectedTodo(null)
      } catch (error) {
        console.error('Fehler beim Löschen:', error)
        alert('Fehler beim Löschen des Todos')
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Hi {username}</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="filter-buttons">
        <button
          className={`button ${!showDone ? 'active' : ''}`}
          onClick={() => setShowDone(false)}
        >
          Offene Todos
        </button>
        <button
          className={`button ${showDone ? 'active' : ''}`}
          onClick={() => setShowDone(true)}
        >
          Erledigte Todos
        </button>
      </div>

      <table className="todo-table">
        <thead>
          <tr>
            <th onClick={() => setSelectedTodo(null)} style={{ cursor: 'pointer' }}>Name</th>
            <th onClick={() => filteredTodos.length && setSelectedTodo(filteredTodos[0])} style={{ cursor: 'pointer' }}>Fällig</th>
            <th onClick={() => filteredTodos.length && setSelectedTodo(filteredTodos[0])} style={{ cursor: 'pointer' }}>Kritisch?</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: 20, textAlign: 'center' }}>Keine Todos gefunden.</td>
            </tr>
          ) : (
            filteredTodos.map(todo => (
              <tr key={todo.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTodo(todo)}>
                <td>{todo.name}</td>
                <td className={getDueDateClass(todo.duedate)}>
                  {todo.duedate ? formatDueDate(todo.duedate) : '-'}
                </td>
                <td style={{ textAlign: 'center' }}>{todo.is_critical ? 'Ja' : 'Nein'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button 
          className="button-create"
          onClick={() => setShowCreateModal(true)}
        >
          + Neues Todo
        </button>
      </div>

      {selectedTodo && (
        <TodoDetailModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onEdit={handleEdit}
          onToggleDone={handleToggleDone}
          onDelete={handleDelete}
          currentUserId={user.id}
        />
      )}

      {showCreateModal && (
        <TodoCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

export default Todos