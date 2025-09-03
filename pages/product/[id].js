
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

