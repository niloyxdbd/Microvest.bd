import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Product({ product }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [msg, setMsg] = useState('')

  async function placeOrder(e) {
    e.preventDefault()
    setMsg('')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        name,
        phone,
        address
      })
    })

    const data = await res.json()
    if (!res.ok) return setMsg(data.error || 'Failed to place order')
    setMsg(`✅ Order placed! Your order ID: ${data.id}`)
  }

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>৳ {product.price}</strong></p>

      <form onSubmit={placeOrder}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <button type="submit">Order (COD)</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  )
}

// Server-side: Supabase থেকে প্রোডাক্ট আনবে
export async function getServerSideProps({ params }) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error) {
    return { notFound: true }
  }

  return { props: { product } }
}
