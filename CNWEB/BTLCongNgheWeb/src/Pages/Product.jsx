import React, { useContext } from "react";
import ProductDetail from "../Components/ProductDetail/ProductDetail";
import { useParams } from "react-router-dom";

import { ProductContext } from "../Context/ProductContext";

const Product = () => {
    const {productId} = useParams();
    const {product} = useContext(ProductContext);
    const productDt = product.find((prod) => prod.id === productId)
    return (
      <div>
          <ProductDetail product={productDt}/>
      </div>
    )
};

export default Product;
