import React from 'react'
import './TodoDetailModal.css'

function TodoDetailModal({ todo, onClose, onEdit, onToggleDone, onDelete, currentUserId }) {
  if (!todo) return null

  const canDelete = currentUserId === todo.author
  console.log("ID: ", todo.id);
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Todo Details</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{todo.name}</td>
            </tr>
            <tr>
              <td><strong>Beschreibung</strong></td>
              <td>{todo.description || '-'}</td>
            </tr>
            <tr>
              <td><strong>Fällig am</strong></td>
              <td>{todo.duedate ? new Date(todo.duedate).toLocaleDateString() : '-'}</td>
            </tr>
            <tr>
              <td><strong>Kritisch</strong></td>
              <td>{todo.is_critical ? 'Ja' : 'Nein'}</td>
            </tr>
            <tr>
              <td><strong>Erledigt</strong></td>
              <td>{todo.done ? 'Ja' : 'Nein'}</td>
            </tr>
          </tbody>
        </table>

        <div className="modal-buttons">
          <button onClick={onEdit}>Bearbeiten</button>
          <button onClick={() => onToggleDone(todo)}>
            {todo.done ? 'Unerledigt setzen' : 'Erledigt setzen'}
          </button>
          {canDelete && (
            <button className="btn-delete" onClick={onDelete}>Löschen</button>
          )}
          <button className="btn-close" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  )
}

export default TodoDetailModal