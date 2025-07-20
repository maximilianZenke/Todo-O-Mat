import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './api/supabaseClient'
import Login from './components/Login'
import Todos from './components/Todos'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aktuellen User beim Laden prüfen
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Listener für Auth-Status-Änderungen
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div>Lädt...</div>

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/todos" replace />}
        />
        <Route
          path="/todos"
          element={user ? <Todos user={user} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? "/todos" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

export default App