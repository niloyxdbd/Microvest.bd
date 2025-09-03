```jsx
import Link from 'next/link'
import fs from 'fs'
import path from 'path'


export default function Home({ products }){
return (
<div className="container">
<header className="header">
<div className="logo">MicroVest</div>
<Link href="/track"><a className="small">Track Order</a></Link>
</header>


<div className="grid">
<div>
{products.map(p => (
<div key={p.id} className="card" style={{marginBottom:14}}>
<img src={p.images?.[0]} alt={p.name} className="product-image" />
<h2>{p.name}</h2>
<p className="small">{p.short}</p>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
<div>
<div style={{fontSize:20,fontWeight:700}}>৳ {p.price}</div>
<div className="small" style={{textDecoration:'line-through',color:'#c00'}}>{p.mrp} TK</div>
</div>
<Link href={`/product/${p.id}`}><a className="button">Order Now</a></Link>
</div>
</div>
))}
</div>


<aside>
<div className="card">
<h3>Contact / Support</h3>
<p className="small">অর্ডার করতে ফোন করুন: 01718856118</p>
<p className="small">Admin: <a href="/admin">Admin Panel</a></p>
</div>
</aside>
</div>
</div>
)
}


export async function getStaticProps(){
const p = path.join(process.cwd(),'data/products.json')
const products = JSON.parse(fs.readFileSync(p,'utf8'))
return {props:{products}}
}
```
