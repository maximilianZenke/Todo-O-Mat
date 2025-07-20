import { supabase } from './supabaseClient'

export async function getCurrentUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Fehler beim Laden des Benutzerprofils:', error)
    return null
  }

  return data
}