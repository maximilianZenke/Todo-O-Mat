import React, { useState } from 'react'
import './TodoDetailModal.css'

function TodoCreateModal({ onClose, onCreate }) {
  const [newTodo, setNewTodo] = useState({
    name: '',
    description: '',
    duedate: '',
    is_critical: false
  })

  const handleSave = () => {
    // Validierung: Name ist erforderlich
    if (!newTodo.name.trim()) {
      alert('Bitte gib einen Namen für das Todo ein.')
      return
    }

    // Erstelle das Todo-Objekt
    const todoData = {
      name: newTodo.name.trim(),
      description: newTodo.description.trim() || null,
      duedate: newTodo.duedate || null,
      is_critical: newTodo.is_critical,
      done: false
    }

    onCreate(todoData)
  }

  const handleCancel = () => {
    setNewTodo({
      name: '',
      description: '',
      duedate: '',
      is_critical: false
    })
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Neues Todo erstellen</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <table>
          <tbody>
            <tr>
              <td><strong>Name*</strong></td>
              <td>
                <input
                  type="text"
                  value={newTodo.name}
                  onChange={(e) => setNewTodo({...newTodo, name: e.target.value})}
                  className="edit-input"
                  placeholder="Todo-Name eingeben..."
                  autoFocus
                />
              </td>
            </tr>
            <tr>
              <td><strong>Beschreibung</strong></td>
              <td>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                  rows="3"
                  className="edit-textarea"
                  placeholder="Optionale Beschreibung..."
                />
              </td>
            </tr>
            <tr>
              <td><strong>Fällig am</strong></td>
              <td>
                <input
                  type="date"
                  value={newTodo.duedate}
                  onChange={(e) => setNewTodo({...newTodo, duedate: e.target.value})}
                  className="edit-date"
                />
              </td>
            </tr>
            <tr>
              <td><strong>Kritisch</strong></td>
              <td>
                <input
                  type="checkbox"
                  checked={newTodo.is_critical}
                  onChange={(e) => setNewTodo({...newTodo, is_critical: e.target.checked})}
                  className="edit-checkbox"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="modal-buttons">
          <div className="button-row">
            <button onClick={handleSave}>Erstellen</button>
            <button onClick={handleCancel}>Abbrechen</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoCreateModal