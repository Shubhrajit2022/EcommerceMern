import React, { Fragment, useEffect } from 'react'
// import {TbHandClick} from 'react-icons/tb'
import './Home.css'
import Product from './ProductCard.js'
import ImageSlider from './ImageSlider.js'
import MetaData from '../layout/MetaData'
import {getProduct} from '../../actions/productAction'
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../layout/loader/loader'
import { useAlert } from 'react-alert'
const Home = () => {
  const dispatch = useDispatch()
  const {loading,error,products,productsCount} = useSelector((state)=>state.products)

  const alert = useAlert()
  useEffect(()=>{
    if(error){
      return alert.error(error)
    }
    dispatch(getProduct())
  },[dispatch,error,alert])
  const slides = [
    { url: "https://wallpapercave.com/wp/wp4459829.jpg", title: "men-jacket" },
    { url: "https://wallpapercave.com/w/wp4459828.jpg", title: "women-jacket" },
    { url: "https://images-cdn.newscred.com/Zz1lY2UyZGZjN2U5OWVkMjVkZjdkYmFiNDUzZGY4OGEzNQ==/jacket.png", title: "winter-wear" },
    { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wc3xlbnwwfHwwfHw%3D&w=1000&q=80", title: "laptop" },
    { url: "https://i.pcmag.com/imagery/articles/031D6LS2y4D8F4qk4nLZpIb-13..v1631722248.jpg", title: "Mobile" },
    { url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c25lYWtlcnN8ZW58MHx8MHx8&w=1000&q=80.jpg", title: "sneaker" },
    { url: "https://img.freepik.com/free-vector/household-appliances-gift-realistic_1284-65309.jpg", title: "electronic appliences" },
  ];
  const containerStyles = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
  };
  return (
    <Fragment>
      {loading ? (<Loader/>) : (<Fragment>

<MetaData title= 'ECOMMERCE'/>
  <div className="banner">
      <div style={containerStyles}>
  <ImageSlider slides={slides} />
</div>
      <p>Welcome to E-commerce</p>
      <h1>We have amazing products just for you</h1>
      <h3>Discover 3500+ brands of products</h3>
      <a href='#container'>
        <div className='btn-find'>
          <button>
              Find Out More
          </button>
          </div>
      </a>
  </div>
  <h2 className='homeHeading'>Our Featured Products</h2>

  <div className="container" id='container'>

{products && 
    products.map((product)=> (
    <Product key={product._id} product={product}/>
))}
  </div>
</Fragment>)}
    </Fragment>
  )
}

export default Home