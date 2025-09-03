```jsx
export default function Track(){
const [oid,setOid]=useState('')
const [phone,setPhone]=useState('')
const [found,setFound]=useState(null)


function check(e){
e.preventDefault()
const all = JSON.parse(localStorage.getItem('mv_orders')||'[]')
const order = all.find(o=>o.id===oid && o.phone===phone)
setFound(order||false)
}


return (
<div className="container">
<div className="card">
<h2>Track Order</h2>
<form onSubmit={check}>
<div style={{marginBottom:8}}>
<input className="input" placeholder="Order ID (e.g. MV-xxxxx)" value={oid} onChange={e=>setOid(e.target.value)} />
</div>
<div style={{marginBottom:8}}>
<input className="input" placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
</div>
<button className="button" type="submit">Check</button>
</form>


{found===false && <div style={{marginTop:12}}>Order not found. Check ID and phone.</div>}
{found && (
<div style={{marginTop:12}}>
<h3>Order {found.id}</h3>
<div>Status: <strong>{found.status}</strong></div>
<div>Product: {found.productId}</div>
<div>Qty: {found.qty}</div>
<div>Name: {found.name}</div>
<div>Address: {found.address}</div>
</div>
)}
</div>
</div>
)
}
```
