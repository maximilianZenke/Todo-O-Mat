import React, { useState } from 'react'
import './TodoDetailModal.css'

function TodoDetailModal({ todo, onClose, onEdit, onToggleDone, onDelete, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTodo, setEditedTodo] = useState({
    name: todo.name,
    description: todo.description || '',
    duedate: todo.duedate || '',
    is_critical: todo.is_critical
  })

  if (!todo) return null

  const canDelete = currentUserId === todo.author

  const handleSave = () => {
    const updates = {}
    if (editedTodo.name !== todo.name) updates.name = editedTodo.name
    if (editedTodo.description !== (todo.description || '')) updates.description = editedTodo.description
    if (editedTodo.duedate !== (todo.duedate || '')) updates.duedate = editedTodo.duedate || null
    if (editedTodo.is_critical !== todo.is_critical) updates.is_critical = editedTodo.is_critical

    if (Object.keys(updates).length > 0) {
      onEdit(updates)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTodo({
      name: todo.name,
      description: todo.description || '',
      duedate: todo.duedate || '',
      is_critical: todo.is_critical
    })
    setIsEditing(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Todo Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <table>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTodo.name}
                    onChange={(e) => setEditedTodo({...editedTodo, name: e.target.value})}
                    className="edit-input"
                  />
                ) : (
                  todo.name
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Beschreibung</strong></td>
              <td>
                {isEditing ? (
                  <textarea
                    value={editedTodo.description}
                    onChange={(e) => setEditedTodo({...editedTodo, description: e.target.value})}
                    rows="3"
                    className="edit-textarea"
                  />
                ) : (
                  todo.description || '-'
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Fällig am</strong></td>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedTodo.duedate}
                    onChange={(e) => setEditedTodo({...editedTodo, duedate: e.target.value})}
                    className="edit-date"
                  />
                ) : (
                  todo.duedate ? new Date(todo.duedate).toLocaleDateString() : '-'
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Kritisch</strong></td>
              <td>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedTodo.is_critical}
                    onChange={(e) => setEditedTodo({...editedTodo, is_critical: e.target.checked})}
                    className="edit-checkbox"
                  />
                ) : (
                  todo.is_critical ? 'Ja' : 'Nein'
                )}
              </td>
            </tr>
            <tr>
              <td><strong>Erledigt</strong></td>
              <td>{todo.done ? 'Ja' : 'Nein'}</td>
            </tr>
          </tbody>
        </table>

        <div className="modal-buttons">
          {isEditing ? (
            <div className="button-row">
              <button onClick={handleSave}>Speichern</button>
              <button onClick={handleCancel}>Abbrechen</button>
            </div>
          ) : (
            <>
              <div className="button-row">
                <button onClick={() => setIsEditing(true)}>Bearbeiten</button>
                <button className="btn-toggle-done" onClick={() => onToggleDone(todo)}>
                  {todo.done ? 'Unerledigt setzen' : 'Erledigt setzen'}
                </button>
              </div>
              {canDelete && (
                <div className="button-row single">
                  <button className="btn-delete" onClick={() => onDelete(todo)}>Löschen</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoDetailModal