import { supabase } from './supabaseClient'

// In deiner todoService.js - erweitere die bestehende Funktion

export async function getTodosWithProfiles() {
  const { data, error } = await supabase
    .from('todos')
    .select(`
      id,
      name,
      description,
      is_critical,
      duedate,
      done,
      created_at,
      author,
      profiles!todos_assigned_to_fkey(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fehler beim Laden der Todos:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createTodo(todoData) {
  console.log("Creating todo: ", todoData);
  
  const { data, error } = await supabase
    .from('todos')
    .insert(todoData)
    .select()

  if (error) {
    console.error('Fehler beim Erstellen des Todos:', error)
    throw error
  }
  return data
}

export async function toggleTodoDone(id, currentDoneStatus) {
  console.log("ID inside function: ", id);
  const { data, error } = await supabase
    .from('todos')
    .update({ done: !currentDoneStatus })
    .eq('id', id)

  if (error) {
    console.error('Fehler beim Umschalten des Erledigt-Status:', error)
    throw error
  }
  return data
}

export async function updateTodo(id, updates) {
  console.log("Updating todo: ", id,  updates);
  const {data, error} = await supabase
  .from('todos')
  .update(updates)
  .eq('id', id)

  if (error) {
    console.error('Fehler beim Aktualisieren des Todos', error)
    throw error
  }
  return data
}


export async function deleteTodo(id) {
  console.log("Deleting todo with ID: ", id);
  
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Fehler beim Löschen des Todos:', error)
    throw error
  }
  return data
}