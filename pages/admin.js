
}


function addProduct(e){
e.preventDefault()
const p = [...products, {...newProduct, id: newProduct.id || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), images: ['/images/mushroom-jar.jpg'], price: Number(newProduct.price)}]
setProducts(p)
localStorage.setItem('mv_products', JSON.stringify(p))
setNewProduct({id:'',name:'',price:'',stock:0,short:'',description:'',images:[]})
alert('Product added locally. To persist across deployments, edit data/products.json in the repo.')
}


if(!authed) return (
<div className="container"><div className="card"><h3>Admin Login</h3><form onSubmit={login}><input className="input" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} /><div style={{marginTop:8}}><button className="button">Login</button></div></form></div></div>
)


return (
<div className="container">
<h2>Admin Panel</h2>
<div className="card">
<h3>Orders</h3>
{orders.length===0 && <div className="small">No orders yet</div>}
{orders.map(o=> (
<div key={o.id} style={{borderTop:'1px solid #eee',paddingTop:8,marginTop:8}}>
<div><strong>{o.id}</strong> — {o.name} — {o.phone}</div>
<div>Status: <select value={o.status} onChange={(e)=>updateStatus(o.id,e.target.value)}><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></div>
</div>
))}
</div>


<div className="card" style={{marginTop:12}}>
<h3>Add Product (local)</h3>
<form onSubmit={addProduct}>
<input className="input" placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} />
<input className="input" placeholder="Price" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} />
<input className="input" placeholder="Short" value={newProduct.short} onChange={e=>setNewProduct({...newProduct,short:e.target.value})} />
<textarea className="input" placeholder="Description" value={newProduct.description} onChange={e=>setNewProduct({...newProduct,description:e.target.value})}></textarea>
<div style={{marginTop:8}}><button className="button" type="submit">Add Product</button></div>
</form>
<div className="small" style={{marginTop:8}}>Note: product added here is saved to your browser. To make it permanent for everyone, edit <code>data/products.json</code> in the GitHub repo and redeploy.</div>
</div>
</div>
)
}

