import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export default function Product({ product }){
const [qty,setQty] = useState(1)
const [name,setName]=useState('')
const [phone,setPhone]=useState('')
const [address,setAddress]=useState('')
const [note,setNote]=useState('')
const [message,setMessage]=useState('')
const [reviews,setReviews]=useState([])
const [reviewText,setReviewText]=useState('')

useEffect(()=>{
const key = `mv_reviews_${product.id}`
const r = JSON.parse(localStorage.getItem(key) || '[]')
setReviews(r)
},[])

function placeOrder(e){
e.preventDefault()
if(!name || !phone || !address){ setMessage('Name, phone and address required'); return }
const orderId = 'MV-'+Date.now().toString(36).slice(-6)
const order = { id: orderId, productId: product.id, name, phone, address, qty, note, status: 'Pending', createdAt:Date.now() }
const all = JSON.parse(localStorage.getItem('mv_orders')||'[]')
all.push(order)
localStorage.setItem('mv_orders', JSON.stringify(all))
setMessage(`Order placed. Your Order ID: ${orderId}`)
// Optionally: POST to Formspree if NEXT_PUBLIC_FORMSPREE_URL is set (serverless)
// clear
}

function addReview(e){
e.preventDefault()
const key = `mv_reviews_${product.id}`
const r = JSON.parse(localStorage.getItem(key)||'[]')
r.unshift({text:reviewText, at:Date.now()})
localStorage.setItem(key, JSON.stringify(r))
setReviews(r)
setReviewText('')
}

return (
<div className="container">
<div style={{display:'flex',gap:20}}>
<div style={{flex:1}}>
<img src={product.images?.[0]} alt={product.name} className="product-image" />
</div>
<div style={{width:420}}>
<div className="card">
<h1>{product.name}</h1>
<div style={{marginBottom:8}}>
<span className="badge">{product.stock} in stock</span>
<div style={{fontSize:22,fontWeight:700,marginTop:6}}>৳ {product.price}</div>
</div>
<p className="small">{product.description}</p>

<form onSubmit={placeOrder}>
<label className="small">Quantity</label>
<div className="qty" style={{marginBottom:8}}>
<button type="button" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
<div>{qty}</div>
<button type="button" onClick={()=>setQty(q=>q+1)}>+</button>
</div>
<div style={{marginBottom:8}}>
<input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
</div>
<div style={{marginBottom:8}}>
<input className="input" placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
</div>
<div style={{marginBottom:8}}>
<textarea className="input" rows={3} placeholder="Delivery address" value={address} onChange={e=>setAddress(e.target.value)} />
</div>
<div style={{marginBottom:8}}>
<input className="input" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
</div>
<div style={{marginBottom:8}}>
<label className="small">Payment method</label>
<div>Cash on Delivery (COD)</div>
</div>
<button className="button" type="submit">Place Order (COD)</button>
</form>
{message && <p style={{marginTop:10}}>{message}</p>}

</div>


<div className="card" style={{marginTop:12}}>
<h3>Reviews</h3>
<form onSubmit={addReview}>
<textarea className="input" rows={3} placeholder="Write a review" value={reviewText} onChange={e=>setReviewText(e.target.value)}></textarea>
<div style={{marginTop:8}}>
<button className="button" type="submit">Add Review</button>
</div>
</form>
<div style={{marginTop:12}}>
{reviews.length===0 && <div className="small">No reviews yet</div>}
{reviews.map((r,i)=>(
<div key={i} style={{borderTop:'1px solid #eee',paddingTop:8,marginTop:8}}>
<div className="small">{new Date(r.at).toLocaleString()}</div>
<div>{r.text}</div>
</div>
))}
</div>
</div>


</div>
</div>
</div>
)
}

export async function getStaticPaths(){
const p = path.join(process.cwd(),'data/products.json')
const products = JSON.parse(fs.readFileSync(p,'utf8'))
return {paths: products.map(p=>({params:{id:p.id}})), fallback:false}
}


export async function getStaticProps({params}){
const p = path.join(process.cwd(),'data/products.json')
const products = JSON.parse(fs.readFileSync(p,'utf8'))
const product = products.find(x=>x.id===params.id)
return {props:{product}}
}
