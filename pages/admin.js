import React, { useState, useEffect } from 'react'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function loadOrders() {
    const res = await fetch('/api/admin-orders?password=' + password)
    const data = await res.json()
    if (res.ok) setOrders(data)
    else setMsg(data.error || 'Failed to fetch orders')
  }

  async function updateOrder(id, status) {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, password })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error)
    alert('Updated!')
    loadOrders()
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={loadOrders}>Load Orders</button>
      {msg && <p>{msg}</p>}

      <table border="1" cellPadding="6" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.product_id}</td>
              <td>{o.name}</td>
              <td>{o.phone}</td>
              <td>{o.address}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => updateOrder(o.id, 'Shipped')}>Shipped</button>
                <button onClick={() => updateOrder(o.id, 'Delivered')}>Delivered</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
