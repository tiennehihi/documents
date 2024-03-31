import React, { useContext, useEffect, useState } from "react";
import "./ProductList.css";
import ProductItem from "../ProductItem/ProductItem";
import axios from "axios";
import Filter from "../Filter/Filter";
import { ProductContext } from "../../Context/ProductContext";


const ProductList = () => {
  const {product} = useContext(ProductContext)

  return (
    <div className="productlist grid grid-cols-12 gap-2 mx-5" style={{background: "#fff"}}>
      <div className="header-nav sm:col-span-12 lg:hidden md:hidden sm1:hidden sm:block">
        <div className="header-nav-top flex items-center justify-around">
          <p style={{color: "#1BA8FF"}} className="">Phổ biến</p>
          <p className="">Bán chạy</p>
          <p className="">Hàng mới</p>
          <p className="">Giá</p>   
        </div>
        <div className="header-nav-filter flex gap-4">
          <div className="nav-filter"><i className="fa-solid fa-filter"></i> Lọc</div>
          <div className="now">NOW</div>
        </div>
      </div>
      <div className="sidebar col-span-2 md:hidden sm1:hidden sm:hidden">
        <div className="home-link flex items-center ml-4">
          <a href="/" className="home">
            Trang chủ
          </a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="icon-next w-4 h-4 mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          <a href="/" className="home-next-content">
            Nhà sách Tiki
          </a>
        </div>
        <Filter className="" />
      </div>
      <div className="productlist-container col-span-10 md:col-span-12 sm1:col-span-12 sm:col-span-12 grid grid-cols-5  xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-4 sm1:grid-cols-3 sm:grid-cols-2 gap-2 mt-8">
        {product.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
