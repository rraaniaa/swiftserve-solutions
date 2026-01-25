// scripts/seed-initial-users.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl      = 'https://pkfrfaukvnnvkqypxrqp.supabase.co'         
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZnJmYXVrdm5udmtxeXB4cnFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzAwMDAwMCwiZXhwIjoyMDUyNTU2MDAwfQ.sb_publishable_ZooKrguS2gyXcECXF_8DjQ_DUwdJgNp'  


const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: 'admin' | 'employee'
) {
  console.log(`→ Tentative de création : ${email} (${role})`)

  // 1. Création de l'utilisateur dans auth.users
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,                  // ← on bypass la confirmation email
    user_metadata: { full_name: fullName },
  })

  if (createError) {
    console.error(`ÉCHEC pour ${email} :`, createError.message)
    if (createError.message.includes('duplicate key')) {
      console.log('→ Cet email existe déjà → on passe au suivant')
    }
    return false
  }

  const userId = userData.user.id
  console.log(`Utilisateur créé avec succès → ID: ${userId}`)

  // 2. Mise à jour du profil (le trigger a déjà créé une ligne → on update juste)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      full_name: fullName,
      role: role,
    })
    .eq('user_id', userId)

  if (profileError) {
    console.error(`Problème mise à jour profil pour ${email} :`, profileError.message)
    return false
  }

  console.log(`Profil mis à jour → rôle = ${role}`)
  return true
}

async function seedUsers() {
  console.log('====================================')
  console.log('🌱 Début création des comptes initiaux')
  console.log('====================================\n')

  const usersToCreate = [
    {
      email: 'admin@gmail.com',
      password: '123456',           // ← CHANGE ÇA TOUT DE SUITE APRÈS !
      fullName: 'Administrateur Principal',
      role: 'admin' as const,
    },
    {
      email: 'technicien1@gmail.com',
      password: '123456',
      fullName: 'Technicien Mohamed',
      role: 'employee' as const,
    },
    {
      email: 'technicienne2@gmail.com',
      password: '123456',
      fullName: 'Technicienne Amina',
      role: 'employee' as const,
    },
  ]

  let successCount = 0

  for (const user of usersToCreate) {
    const success = await createUser(
      user.email,
      user.password,
      user.fullName,
      user.role
    )
    if (success) successCount++
    console.log('───────────────────────────────────────\n')
  }

  console.log(`Résultat final : ${successCount}/3 comptes créés avec succès`)
  console.log('\n⚠️  CHANGE TOUS LES MOTS DE PASSE IMMÉDIATEMENT !')
  console.log('→ Connecte-toi avec ces comptes puis fais "Mot de passe oublié" ou change via dashboard')
}

seedUsers()
  .then(() => console.log('Script terminé\n'))
  .catch(err => console.error('Erreur fatale dans le script :', err))