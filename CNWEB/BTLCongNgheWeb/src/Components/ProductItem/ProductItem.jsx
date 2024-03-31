import React from 'react'
import './ProductItem.css'
import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => {
   
    const image =  product.images[0]?.base_url;
    const stars = Array.from({length: 5}, (_, index) => index < Math.floor(product.rating_average))
    const discount = Math.floor(Math.random() * 100)

  return (
    <div className='productitem col-span-1 xl:col-span-1 lg:col-span-1 md:col-span-1 sm1:col-span-1 sm:col-span-1'>
        <Link to={`/product/${product.id}`}>
            <div className="productitem-img" style={{backgroundImage: `url(${image})`}}></div>
        </Link>
        <div className="productitem-info px-2">
                <h2 className="productitem-name">{product.name}</h2>
                <div className="productitem-rating-sold flex justify-start items-baseline">
                    <div className="productitem-raiting">
                        {stars.map((isTrue, index) => (
                            <i key={index} className="fa-solid fa-star" style={{color: isTrue ? "gold" : "gray", fontSize: "8px"}}></i>
                        ))}
                    </div>
                    <div className="productitem-sold px-2">{product.quantity_sold?.text}</div>
                </div>
        </div>
        <div className="productitem-price px-2">
            <div className="productitem-newprice">{product.original_price}<sup>đ</sup></div>
            <div className="productitem-discount">-{discount}%</div>
        </div>
        <div className="productitem-ship text-center mt-6 pt-2">Giao siêu tốc 2h</div>
    </div>
  )
}

export default ProductItem