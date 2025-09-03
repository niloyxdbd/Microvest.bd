// pages/api/orders.js
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Create order
      const { product_id, product_slug, name, phone, address, qty = 1, note = '' } = req.body
      if (!name || !phone || !address || !product_slug) {
        return res.status(400).json({ error: 'Missing fields' })
      }

      // server generate order id
      const orderId = 'MV-' + Date.now().toString(36).slice(-6)

      const payload = {
        id: orderId,
        product_id: product_id || null,
        product_slug,
        name,
        phone,
        address,
        qty,
        note,
        status: 'Pending'
      }

      const { data, error } = await supabase.from('orders').insert(payload).select().single()
      if (error) throw error

      return res.status(201).json({ order: data })
    }

    if (req.method === 'GET') {
      // Track order: /api/orders?orderId=MV-abc&phone=01xxxx
      const { orderId, phone } = req.query
      if (!orderId || !phone) return res.status(400).json({ error: 'orderId and phone required' })

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('phone', phone)
        .limit(1)
      if (error) throw error
      if (data.length === 0) return res.status(404).json({ error: 'Order not found' })
      return res.status(200).json(data[0])
    }

    if (req.method === 'PATCH') {
      // admin update order status
      const adminPass = req.headers['x-admin-pass'] || req.body.adminPass
      if (adminPass !== process.env.ADMIN_PASS) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id, status } = req.body
      if (!id || !status) return res.status(400).json({ error: 'id and status required' })

      const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single()
      if (error) throw error
      return res.status(200).json(data)
    }

    return res.setHeader('Allow', ['POST', 'GET', 'PATCH']).status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
