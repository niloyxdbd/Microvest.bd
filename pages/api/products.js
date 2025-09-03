
// pages/api/products.js
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // fetch all products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      // add new product (admin)
      const adminPass = req.headers['x-admin-pass'] || req.body.adminPass
      if (adminPass !== process.env.ADMIN_PASS) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { name, slug, price, mrp, stock, images, short, description } = req.body
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,''),
        price,
        mrp,
        stock,
        images: images || [],
        short,
        description
      }

      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if (error) throw error
      return res.status(201).json(data)
    }

    return res.setHeader('Allow', ['GET', 'POST']).status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
