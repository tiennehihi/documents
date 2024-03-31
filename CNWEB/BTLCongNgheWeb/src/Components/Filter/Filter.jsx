import React from "react";
import "./Filter.css";

const Filter = () => {
  return (
    <div className="filter ml-1 pl-3">
      <div className="category mt-3">
        <div className="category-products">
          <h2>Danh mục sản phẩm</h2>
          <ul className="category-products-list">
            <li className="category-products-item">
              <a href="/">English book</a>
            </li>
            <li className="category-products-item">
              <a href="/">Sách tiếng việt</a>
            </li>
            <li className="category-products-item">
              <a href="/">Văn phòng phẩm</a>
            </li>
            <li className="category-products-item">
              <a href="/">Quà lưu niệm</a>
            </li>
          </ul>
        </div>
        <div className="vendor">
          <h2>Nhà cung cấp</h2>
          <ul className="vendor-list">
            <li className="vendor-item">
              <input type="checkbox" name="" id="item1" />
              <label htmlFor="item1">Nhà sách Fahasa</label>
            </li>
            <li className="vendor-item">
              <input type="checkbox" name="" id="item2" />
              <label htmlFor="item2">Bamboo Books</label>
            </li>
            <li className="vendor-item">
              <input type="checkbox" name="" id="item3" />
              <label htmlFor="item3">Time Book</label>
            </li>
            <li className="vendor-item">
              <input type="checkbox" name="" id="item4" />
              <label htmlFor="item4">Nhà sách Online</label>
            </li>
            <li className="vendor-item">
              <input type="checkbox" name="" id="item5" />
              <label htmlFor="item5">VBooks</label>
            </li>
          </ul>
        </div>
        <div className="rating">
          <h2>Đánh giá</h2>
          <div className="rating-detail">
            <div className="rating-star">
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
            </div>
            <span>Từ 5 sao</span>
          </div>
          <div className="rating-detail">
            <div className="rating-star">
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <span>Từ 4 sao</span>
          </div>
          <div className="rating-detail">
            <div className="rating-star">
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="star-gold fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <span>Từ 3 sao</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
