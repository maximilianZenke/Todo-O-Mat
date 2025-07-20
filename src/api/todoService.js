import { supabase } from './supabaseClient'

export async function getTodosWithProfiles() {
  return supabase
    .from('todos')
    .select(`
      id,
      name,
      description,
      done,
      duedate,
      is_critical,
      profiles_author:author ( name )
    `)
    .order('is_critical', { ascending: false })
    .order('duedate', { ascending: true })
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