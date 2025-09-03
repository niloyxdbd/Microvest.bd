// pages/api/orders.js
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // ✅ Place order
    const { product_id, name, phone, address } = req.body

    const { data, error } = await supabase
      .from('orders')
      .insert([{ product_id, name, phone, address, status: 'Pending' }])
      .select()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'GET') {
    // ✅ Track order
    const { orderId, phone } = req.query
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('phone', phone)
      .single()

    if (error) return res.status(404).json({ error: 'Order not found' })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    // ✅ Admin update
    const { id, status, password } = req.body
    if (password !== process.env.ADMIN_PASS) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
