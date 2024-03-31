import React from 'react'
import './ProductDetail.css'

const ProductDetail = (props) => {
  const {product} = props


  return (
    <div className='productdetail grid-cols-12 gap-2 mx-5'>
      <div className="productdetail-left col-span-3">
        <div className="productitem-img" style={{backgroundImage: `url(${product.images[0]?.base_url})`}}></div>
        <div className="productitem-img-thumbnail"></div>
      </div>
      <div className="productdetail-between col-span-6">

      </div>
      <div className="productdetail-right col-span-3">

      </div>
    </div>
  )
}

export default ProductDetail