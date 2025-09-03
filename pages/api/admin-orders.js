// pages/api/admin-orders.js
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const { password } = req.query
  if (password !== process.env.ADMIN_PASS) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json(data)
}
