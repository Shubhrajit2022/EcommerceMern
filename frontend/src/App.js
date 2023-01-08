import React, { useEffect } from 'react'
import "./App.css";
import Header from './component/layout/Header/Header.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WebFont from 'webfontloader'
import Footer from './component/layout/Footer/Footer.js'
import Home from './component/Home/Home.jsx'
import ProductDetails from './component/Product/ProductDetails.jsx'
import Products from './component/Product/Products.jsx'
import Search from './component/Product/Search.jsx'
import LogInSignUp from './component/user/LogInSignUp';
import Profile from './component/user/Profile.jsx'
import UpdateProfile from './component/user/UpdateProfile.jsx'
import UpdatePassword from './component/user/UpdatePassword.jsx'
import ForgotPassword from './component/user/ForgotPassword.jsx'
import ResetPassword from './component/user/ResetPassword.jsx'
import Cart from './component/cart/Cart.jsx'
import Confirm from './component/cart/Confirm.jsx'
import Shipping from './component/cart/Shipping.jsx'
import store from './store'
import { loadUser } from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions.jsx'
import { useSelector } from 'react-redux';
import ProtectedRoute from './component/Route/ProtectedRoute';
const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect (()=>{
    WebFont.load({
      google:{
        families: ["Roboto","Droid Sands","Chilanka"]
      }
    })
    store.dispatch(loadUser())
  },[])
  return (
    <BrowserRouter>
    <Header/>
    {isAuthenticated && <UserOptions user={user} />}
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/product/:id' element={<ProductDetails/>}/>
    <Route path='/products' element={<Products/>}/>
    <Route path='/products/:keyword' element={<Products/>}/>
    <Route path="/account/*" element={<ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }/>
    <Route path='/me/update' element={
      <ProtectedRoute>
        <UpdateProfile/>
      </ProtectedRoute>
    }/>
    <Route path='/password/update' element={
      <ProtectedRoute>
        <UpdatePassword/>
      </ProtectedRoute>
    }/>
    <Route path='/shipping' element={
      <ProtectedRoute>
        <Shipping/>
      </ProtectedRoute>
    }/>
    <Route path='/password/forgot' element={<ForgotPassword/>}/>
    <Route path='/password/reset/:token' element={<ResetPassword/>}/>
    <Route path='/search' element={<Search/>}/>
    <Route path='/cart' element={<Cart/>}/>
    <Route path='/order/confirm' element={<Confirm/>}/>
    <Route path='/login' element={<LogInSignUp/>}/>

    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App