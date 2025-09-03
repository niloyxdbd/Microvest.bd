import React from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home({ products }) {
  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: 20 }}>
      <h1>Our Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <img
              src={p.images?.[0] || '/placeholder.png'}
              alt={p.name}
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }}
            />
            <h3>{p.name}</h3>
            <p>{p.short}</p>
            <p><strong>৳ {p.price}</strong></p>
            <Link href={`/product/${p.slug || p.id}`} legacyBehavior>
              <a style={{ color: '#19a34a' }}>View Product</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// 👇 এই অংশটায় Supabase থেকে products নিয়ে আসবে
export async function getServerSideProps() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return { props: { products: [] } }
  }

  return { props: { products } }
}
