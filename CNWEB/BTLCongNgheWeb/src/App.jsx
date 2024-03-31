import { useState } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import ProductList from './Components/ProductList/ProductList'
import Footer from './Components/Footer/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Home from './Pages/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
