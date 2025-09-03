import React, { useEffect, useState } from 'react'

export default function Admin() {
  const [pass, setPass] = useState('')
  const [authed, setAuthed] = useState(false)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
    stock: 0,
    short: '',
    description: '',
    images: []
  })

  useEffect(() => {
    // try load products from localStorage first, otherwise fetch static list
    const pLocal = JSON.parse(localStorage.getItem('mv_products') || 'null')
    if (pLocal) {
      setProducts(pLocal)
    } else {
      fetch('/api/products')
        .then((r) => r.json())
        .then((j) => setProducts(j))
        .catch(() => setProducts([]))
    }

    const o = JSON.parse(localStorage.getItem('mv_orders') || '[]')
    setOrders(o)
  }, [])

  useEffect(() => {
    if (authed) {
      const o = JSON.parse(localStorage.getItem('mv_orders') || '[]')
      setOrders(o)
    }
  }, [authed])

  function login(e) {
    e.preventDefault()
    const ok = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123'
    if (pass === ok) setAuthed(true)
    else alert('Wrong password')
  }

  function updateStatus(id, status) {
    const o = JSON.parse(localStorage.getItem('mv_orders') || '[]')
    const updated = o.map((x) => (x.id === id ? { ...x, status } : x))
    localStorage.setItem('mv_orders', JSON.stringify(updated))
    setOrders(updated)
  }

  function addProduct(e) {
    e.preventDefault()
    const pid =
      newProduct.id ||
      newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const pItem = {
      ...newProduct,
      id: pid,
      price: Number(newProduct.price) || 0,
      images: newProduct.images.length ? newProduct.images : ['/images/mushroom-jar.jpg']
    }
    const pArr = [...products, pItem]
    setProducts(pArr)
    localStorage.setItem('mv_products', JSON.stringify(pArr))
    setNewProduct({ id: '', name: '', price: '', stock: 0, short: '', description: '', images: [] })
    alert('Product added locally. To make permanent, edit data/products.json in the repo.')
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: 900, margin: '30px auto', padding: 20 }}>
        <div style={{ borderRadius: 8, padding: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
          <h3>Admin Login</h3>
          <form onSubmit={login}>
            <input
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
              placeholder="Password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div style={{ marginTop: 8 }}>
              <button style={{ background: '#19a34a', color: '#fff', padding: '8px 12px', border: 0 }}>
                Login
              </button>
            </div>
          </form>
          <p style={{ marginTop: 8, color: '#666' }}>
            Default password: <code>admin123</code> (or set <code>NEXT_PUBLIC_ADMIN_PASS</code> in Vercel)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: 20 }}>
      <h2>Admin Panel</h2>

      <div style={{ borderRadius: 8, padding: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <h3>Orders</h3>
        {orders.length === 0 && <div style={{ color: '#666' }}>No orders yet</div>}
        {orders.map((o) => (
          <div key={o.id} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
            <div>
              <strong>{o.id}</strong> — {o.name} — {o.phone}
            </div>
            <div style={{ marginTop: 6 }}>
              Status:{' '}
              <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: 8, padding: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
        <h3>Add Product (local)</h3>
        <form onSubmit={addProduct}>
          <input
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
            placeholder="Short description"
            value={newProduct.short}
            onChange={(e) => setNewProduct({ ...newProduct, short: e.target.value })}
          />
          <textarea
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <div style={{ marginTop: 8 }}>
            <button style={{ background: '#19a34a', color: '#fff', padding: '8px 12px', border: 0 }} type="submit">
              Add Product
            </button>
          </div>
        </form>
        <div style={{ marginTop: 8, color: '#666' }}>
          Note: product added here is saved to your browser only. To make it permanent for everyone, edit <code>data/products.json</code> in the GitHub repo and redeploy.
        </div>
      </div>
    </div>
  )
}
