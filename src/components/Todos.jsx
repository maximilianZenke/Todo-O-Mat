import React, { useEffect, useState } from 'react'
import { getTodosWithProfiles, toggleTodoDone } from '../api/todoService'
import { getCurrentUserProfile } from '../api/userService'
import { supabase } from '../api/supabaseClient'
import { useNavigate } from 'react-router-dom'
import TodoDetailModal from './TodoDetailModal'
import './Todos.css'

function Todos({ user }) {
  const [todos, setTodos] = useState([])
  const [username, setUsername] = useState(null)
  const [showDone, setShowDone] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const navigate = useNavigate()

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

  const handleEdit = () => alert('Editieren noch nicht implementiert')
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
  const handleDelete = () => alert('Löschen noch nicht implementiert')

  return (
    <div className="container">
      <div className="header">
        <h1>Willkommen {username}</h1>
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
            <th onClick={() => filteredTodos.length && setSelectedTodo(filteredTodos[0])} style={{ cursor: 'pointer' }}>Fällig am</th>
            <th onClick={() => filteredTodos.length && setSelectedTodo(filteredTodos[0])} style={{ cursor: 'pointer' }}>Kritisch?</th>
            <th onClick={() => filteredTodos.length && setSelectedTodo(filteredTodos[0])} style={{ cursor: 'pointer' }}>Erledigt?</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: 20, textAlign: 'center' }}>Keine Todos gefunden.</td>
            </tr>
          ) : (
            filteredTodos.map(todo => (
              <tr key={todo.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTodo(todo)}>
                <td>{todo.name}</td>
                <td>{todo.duedate ? new Date(todo.duedate).toLocaleDateString() : '-'}</td>
                <td style={{ textAlign: 'center' }}>{todo.is_critical ? 'Ja' : 'Nein'}</td>
                <td style={{ textAlign: 'center' }}>{todo.done ? 'Ja' : 'Nein'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    </div>
  )
}

export default Todos