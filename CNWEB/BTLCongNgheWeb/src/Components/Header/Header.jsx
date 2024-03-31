import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header flex items-center py-2 pb-3 mb-2">
      <div className="header-logo mx-2 sm:hidden">
        <a href="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/43/Logo_Tiki_2023.png"
            alt=""
            className="header-logo-img m-1"
          />
        </a>
      </div>
      <div className="header-bars lg:hidden md:hidden sm1:hidden sm:block">
        <i className="fa-solid fa-bars ml-4 mr-2"></i>
      </div>
      <div className="header-search flex flex-1 items-center border-2 rounded-md mx-4">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="header-search-icon h-6 w-20 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Freeship đến 30K"
          className="header-search-input flex-1 outline-none cursor-text flex-1"
        />
        <button className="header-search-btn sm:hidden">Tìm kiếm</button>
      </div>
      <div className="header-home ml-8 sm:hidden">
        <a href="/" className="header-home-logo flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="mx-1 sm1:hidden sm:hidden">Trang chủ</span>
        </a>
      </div>
      <div className="header-account mx-5 items-center mx-1 sm1:hidden sm:hidden">
        <a href="/" className="header-account-link">
          <i className="fa-regular fa-face-smile-wink"></i>
          <span className="mx-1">Tài khoản</span>
        </a>
      </div>
      <div className="header-cart mx-4 sm:mx-2 cursor-pointer mr-12">
        <Link to='/cart'>
          <div className="header-cart-wrap relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <span className="header-cart-count flex items-center justify-center">
              0
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
