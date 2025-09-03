
import fs from 'fs'
import path from 'path'
export default function handler(req,res){
const p = path.join(process.cwd(),'data/products.json')
const products = JSON.parse(fs.readFileSync(p,'utf8'))
res.status(200).json(products)
}

